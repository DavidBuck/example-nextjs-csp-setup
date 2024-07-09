// ref - https://github.com/vercel/next.js/issues/45184#issuecomment-1988319088

import { getImageProps } from "next/image"

export default function Image(props) {
  const { props: nextProps } = getImageProps({
    ...props
  })

  const { style: _omit, ...delegated } = nextProps

  return <img {...delegated} />
}