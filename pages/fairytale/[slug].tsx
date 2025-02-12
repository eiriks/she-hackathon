/* eslint-disable @next/next/no-img-element */
import NavigationBar from 'components/molecules/NavigationBar'
import { getAllFairytaleSlugs, getFairytale } from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'
import { iFairytale } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { useState } from 'react'

interface PageProps {
  fairytale: iFairytale
}

interface Query {
  [key: string]: string
}

const generateNewStoryImage = async () => {
  // Add your code here
}

const handleGenerateStory = async () => {
  // Add your code here
}

const FairtalePage = ({ fairytale }: PageProps) => {
  const [storyImage, setStoryImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateNewStoryImage = async () => {
    // Add code here to genereate a new story image based on sanity data, be creative!
    const imagePromt = 'placeholder'

    try {
      const response = await fetch('/api/openai-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fairytale.story.substring(1, 100),
        }),
      }).then((res) => res.json())

      if (response.text) {
        setStoryImage(response.text)
      } else {
        console.log('error')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleGenerateImage = async () => {
    setIsLoading(true)
    await generateNewStoryImage()
    setIsLoading(false)
  }

  return (
    <>
      <NavigationBar />
      <main className="pb-10">
        <div
          style={{
            padding: '15px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Image
            src={
              storyImage === ''
                ? urlForImage(fairytale.coverImage).url()
                : storyImage
            }
            alt=""
            width={256}
            height={256}
          />
          {isLoading && <p>Loading...</p>}
          <button
            className="m-5 rounded-md bg-slate-500 px-2"
            onClick={handleGenerateImage}
          >
            Generate a new image for your story
          </button>

          <h1 style={{ paddingTop: '30px' }}>{fairytale.title}</h1>
          <p style={{ width: '500px', paddingTop: '10px' }}>
            {fairytale.story}
          </p>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  // Get the slug from the context
  const { params = {} } = ctx

  // Fetch the fairytale with the given slug
  const [fairytale] = await Promise.all([getFairytale(params.slug)])

  // If no fairytale was found, return 404
  if (!fairytale) {
    return {
      notFound: true,
    }
  }

  // Return the fairytale for Next.js to use
  return {
    props: {
      fairytale,
      // revalidate every two hours
      revalidate: 60 * 60 * 2,
    },
  }
}

export const getStaticPaths = async () => {
  // Fetch all fairytale slugs
  const slugs = await getAllFairytaleSlugs()

  return {
    paths: slugs?.map(({ slug }) => `/fairytale/${slug}`) || [],
    fallback: 'blocking',
  }
}

export default FairtalePage
