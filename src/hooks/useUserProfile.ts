/**
 * User Profile Hook
 */

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { userService, UserProfile } from '@/services/user.service'

export function useUserProfile() {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!session?.user?.accessToken) {
      setError('No access token available')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Try to get profile from the profile endpoint
      let result = await userService.getProfile(
        session.user.accessToken,
        session.user.sessionId || session.user.id // Use sessionId if available, fallback to user ID
      )

      // If profile endpoint fails, try root endpoint
      if (!result.success) {
        result = await userService.getUserFromRoot(
          session.user.accessToken,
          session.user.sessionId || session.user.id
        )
      }

      if (result.success && result.data) {
        setProfile(result.data)

        // Update the session with the latest user data
        try {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              phone: result.data.phone,
              role: result.data.role,
              isVerified: result.data.isEmailVerified,
              isEmailVerified: result.data.isEmailVerified,
              isPhoneVerified: result.data.isPhoneVerified,
              location: result.data.location,
              isAvailable: result.data.isAvailable,
              partnershipRequest: result.data.partnershipRequest,
              avatar: result.data.avatar,
              createdAt: result.data.createdAt,
              updatedAt: result.data.updatedAt,
            },
          })
        } catch (sessionError) {
          // Don't fail the whole operation if session update fails
        }
      } else {
        // Silently fail - user details from session will be used
        setError(null)
      }
    } catch (err) {
      // Silently fail - user details from session will be used
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = () => {
    fetchProfile()
  }

  // Fetch profile when session is available
  useEffect(() => {
    if (session?.user?.accessToken && !profile) {
      fetchProfile()
    }
  }, [session?.user?.accessToken])

  return {
    profile,
    loading,
    error,
    refreshProfile,
    fetchProfile,
  }
}
