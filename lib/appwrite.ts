import * as Linking from 'expo-linking'
import { openAuthSessionAsync } from 'expo-web-browser'
import { Account, Avatars, Client, OAuthProvider, Query, TablesDB } from 'react-native-appwrite'

export const config = {
	platform: 'com.jsm.restate',
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
	databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
	agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID ,
	galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
	reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
	propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
}

export const client = new Client()

client
	.setEndpoint(config.endpoint!)
	.setProject(config.projectId!)
	.setPlatform(config.platform)

export const avatar = new Avatars(client)
export const account = new Account(client)
export const database = new TablesDB(client)

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

export const getLatestProperties = async () => {
	try {
		const result = await database.listRows({
			databaseId: config.databaseId!,
			tableId: config.propertiesCollectionId!,
			queries: [
				Query.orderAsc('$createdAt'),
				Query.limit(5)
			]
		})

		return result.rows
	} catch (error) {
		console.log(error)
	}
}

export const getProperties = async ({ filter, query, limit }: { filter: string, query: string, limit?: number }) => {
	try {
		const buildQuery = [ Query.orderDesc('$createdAt')]

		if(filter && filter !== 'All')
			buildQuery.push(Query.equal('type', filter))

		if(query) {			
			buildQuery.push(
				Query.or([
					Query.search('name', query),
					Query.search('address', query),
					Query.search('type', query),
				])
			)
		}

		if(limit)
			buildQuery.push(Query.limit(limit))

		const result = await database.listRows({
			databaseId: config.databaseId!,
			tableId: config.propertiesCollectionId!,
			queries: buildQuery
		})

		return result.rows
	} catch (error) {
		console.log(error)
		return []
	}
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await database.getRow({
      databaseId: config.databaseId!,
      tableId: config.propertiesCollectionId!,
      rowId: id
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}