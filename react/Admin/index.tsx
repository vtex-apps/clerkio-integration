import type { FormEvent } from 'react'
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { Dropzone, ButtonPlain } from 'vtex.styleguide'

import GENERATE_ORDER_FEED from './graphql/generateOrderFeed.gql'
import { createBlob, parseXLSToJSON } from './utils/fileParser'

const IDLE = 'IDLE'
const ERROR = 'ERROR'
const LOADING = 'LOADING'
const LOADED = 'LOADED'

type FileParseStatus =
  | typeof IDLE
  | typeof ERROR
  | typeof LOADING
  | typeof LOADED

const ClerkIoAdmin = () => {
  const [parseFileStatus, setParseFileStatus] = useState<FileParseStatus>(IDLE)
  const [file, setFile] = useState<unknown[]>([])
  const [generateOrderFeed] = useMutation<
    {
      generateOrderFeed: string
    },
    {
      orderIdList: Blob
    }
  >(GENERATE_ORDER_FEED)

  const handleFile = async (files: FileList) => {
    if (parseFileStatus === LOADING) {
      return
    }

    setParseFileStatus(LOADING)

    try {
      const fileParsed = await parseXLSToJSON(files[0])

      setFile(fileParsed)
      setParseFileStatus(LOADED)
    } catch {
      setParseFileStatus(ERROR)
    }
  }

  const handleReset = () => {
    setFile([])
    setParseFileStatus(IDLE)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (parseFileStatus !== LOADED) {
      // eslint-disable-next-line no-console
      console.log('file not loaded')

      return
    }

    // eslint-disable-next-line no-console
    console.log(file)
    const fileToBlob = createBlob(file)

    const { data } = await generateOrderFeed({
      variables: {
        orderIdList: fileToBlob,
      },
    })

    // eslint-disable-next-line no-console
    console.log({ data })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Dropzone
        accept=".xlsx"
        onDropAccepted={handleFile}
        onFileReset={handleReset}
      >
        <div className="pt7">
          <span className="f4">Hello</span>
          <span className="f4 c-link" style={{ cursor: 'pointer' }}>
            World
          </span>
        </div>
      </Dropzone>
      <ButtonPlain type="submit">Send id</ButtonPlain>
    </form>
  )
}

export default ClerkIoAdmin
