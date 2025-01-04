'use client'

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

import * as React from 'react'
import { LuSun } from 'react-icons/lu'

export function ColorModeProvider(props) {
  return (
    // Set default theme to 'light' and disable dynamic theme switching
    <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="light" forcedTheme="light" {...props} />
  )
}

export function useColorMode() {
  // Always return 'light' mode with no toggle functionality
  const setColorMode = () => {
    console.warn('Color mode is fixed to light mode.')
  }
  const toggleColorMode = () => {
    console.warn('Color mode is fixed to light mode.')
  }
  return {
    colorMode: 'light',
    setColorMode,
    toggleColorMode,
  }
}

export function useColorModeValue(light, dark) {
  // Always return the 'light' value
  return light
}

export function ColorModeIcon() {
  // Always return the light mode icon
  return <LuSun />
}

export const ColorModeButton = React.forwardRef(function ColorModeButton(props, ref) {
  // Disable the button since toggling is unnecessary
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        variant="ghost"
        aria-label="Color mode is fixed to light"
        size="sm"
        ref={ref}
        isDisabled
        {...props}
        css={{
          _icon: {
            width: '5',
            height: '5',
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})
  