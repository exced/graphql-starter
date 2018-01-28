import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { files } from '../Queries/File'

export const createFolder = gql`
mutation createFolder($input: FolderInput) {
  createFolder(input: $input) {
    id
    title
    createdAt
    updatedAt
    parent
  }
}
`

export const updateFolder = gql`
mutation updateFolder($id: ObjectID!, $input: FolderInput!) {
  updateFolder(id: $id, input: $input) {
    id
    title
    createdAt
    updatedAt
    parent
  }
}
`

export const removeFolder = gql`
mutation removeFolder($id: ObjectID!) {
  removeFolder(id: $id)
}
`

export const createFolderMutation = graphql(createFolder, {
  props: ({ ownProps, mutate }) => ({
    onCreateFolder: (input) => mutate({
      variables: { input },
      update: (store, { data: { createFolder } }) => {
        const data = store.readQuery({ query: files, variables: { offset: 0, limit: 30 } })
        const newData = { ...data, files: [...data.files, createFolder] }
        store.writeQuery({ query: files, variables: { offset: 0, limit: 30 }, data: newData })
      }
    })
  })
})

export const updateFolderMutation = graphql(updateFolder, {
  props: ({ ownProps, mutate }) => ({
    onUpdateFolder: (id, input) => mutate({
      variables: { id, input },
      update: (store, { data: { updateFolder } }) => {
        if (updateFolder) {
          const data = store.readQuery({ query: files, variables: { offset: 0, limit: 30 } })
          const newData = { ...data, files: data.files.map(e => e.id === updateFolder.id ? updateFolder : e) }
          store.writeQuery({ query: files, variables: { offset: 0, limit: 30 }, data: newData })
        }
      }
    })
  })
})

export const removeFolderMutation = graphql(removeFolder, {
  props: ({ ownProps, mutate }) => ({
    onRemoveFolder: (id) => mutate({
      variables: { id },
      update: (store, { data: { removeFolder } }) => {
        if (removeFolder) {
          const data = store.readQuery({ query: files, variables: { offset: 0, limit: 30 } })
          const newData = { ...data, files: data.files.filter(e => e.id !== removeFolder) }
          store.writeQuery({ query: files, variables: { offset: 0, limit: 30 }, data: newData })
        }
      }
    })
  })
})