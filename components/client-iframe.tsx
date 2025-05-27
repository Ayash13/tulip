"use client"

import type React from "react"

import { forwardRef } from "react"

interface ClientIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  srcDoc?: string
  fallbackContent?: React.ReactNode
}

export const ClientIframe = forwardRef<HTMLIFrameElement, ClientIframeProps>(
  ({ srcDoc, fallbackContent, ...props }, ref) => {
    return <iframe ref={ref} srcDoc={srcDoc} {...props} />
  },
)

ClientIframe.displayName = "ClientIframe"
