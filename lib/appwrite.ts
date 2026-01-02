import * as Linking from 'expo-linking'
import { openAuthSessionAsync } from 'expo-web-browser'
import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite'

export const config = {
	platform: 'com.jsm.restate',
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
}

export const client = new Client()

client
	.setEndpoint(config.endpoint!)
	.setProject(config.projectId!)
	.setPlatform(config.platform)

export const avatar = new Avatars(client)
export const account = new Account(client)

export const login = async () => {
	try {
		const redirectUri = Linking.createURL('/')
		const response = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: redirectUri
		})

		if(!response)
			throw new Error('Create OAuth2 token failed')

		const browserResult = await openAuthSessionAsync(
			response.toString(),
			redirectUri
		)

		if(browserResult.type !== 'success')
			throw new Error('Create OAuth2 token failed')

		const url = new URL(browserResult.url)
		const secret = url.searchParams.get('secret')?.toString()
		const userId = url.searchParams.get('userId')?.toString()

		if(!secret || !userId)
			throw new Error('Failed to extract secret or userId from callback URL')

		const session = await account.createSession({ secret, userId })
		
		if(!session)
			throw new Error('Failed to create session')

		return true
	} catch (error) {
		console.log('Login error:', error)
		return false
	}
}

export const logout = async () => {
	try {
		await account.deleteSession({ sessionId: 'current' })
	} catch (error) {
		console.log(error)
		return false
	}
}

export const getCurrentUser = async () => {
	try {
		const response = await account.get()
		
		if(response.$id) {
			const userAvatar = avatar.getInitials()
			return { ...response, avatar: userAvatar.toString() }
		}		
	} catch (error) {
		console.log(error)
		return null
	}
}