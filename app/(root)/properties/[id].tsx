import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export const Property = () => {
	const { id } = useLocalSearchParams()
	return (
		<View>
			<Text>{ id }</Text>
		</View>
	)
}

export default Property