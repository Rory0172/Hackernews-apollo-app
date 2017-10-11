import React, { Component } from 'react'
import {GC_USER_ID} from '../constants'
import {timeDifferenceForDate} from '../utils'
import { gql, graphql } from 'react-apollo'


class Link extends Component {

  componentWillMount(){
    this.userId = localStorage.getItem(GC_USER_ID)
  }

  render() {
  return (
    <div className='flex mt2 items-start'>
      <div className='flex items-center'>
        <span className='gray'>{this.props.index + 1}.</span>
        {this.userId && <div className='ml1 gray f11' onClick={() => this._voteForLink()}>▲</div>}
      </div>
      <div className='ml1'>
        <div>{this.props.link.description} ({this.props.link.url})</div>
        <div className='f6 lh-copy gray'>{this.props.link.votes.length} votes | by {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'} {timeDifferenceForDate(this.props.link.createdAt)}</div>
      </div>
    </div>
  )
}
  _voteForLink = async () => {
    const userID = localStorage.getItem(GC_USER_ID)
    const voterIds = this.props.link.votes.map(vote => vote.user.id)
    if (voterIds.includes(userID)) {
      console.log(`You ${userID} can only voted once!`)
      return
    }
    const linkId = this.props.link.id
    await this.props.createVoteMutation({
      variables:{
        userID,
        linkId
      },
      update: (store, {data: { createVote}}) => {
        this.props.updateStoreAfterVote(store, createVote, linkId)
      }
    })
  }
}

const CREATE_VOTE_MUTATION = gql `
  mutation CreateVoteMutation($userID: ID!, $linkId: ID!) {
    createVote(userId: $userID, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
  `

export default graphql(CREATE_VOTE_MUTATION, {
  name: 'createVoteMutation'
})(Link)