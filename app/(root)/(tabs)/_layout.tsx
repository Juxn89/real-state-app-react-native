import { Tabs } from 'expo-router'
import icons from '@/constants/icons'
import { TabIcon } from '@/components'

export const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{ 
				tabBarShowLabel: false,
				tabBarStyle: { 
					backgroundColor: 'white', 
					position: 'absolute', 
					borderTopColor: '#0061ff1a', 
					borderTopWidth: 1,
					minHeight: 70
				}
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					headerShown: false,
					tabBarIcon: ({ focused }) => ( <TabIcon focused={ focused } icon={ icons.home } title="Home" /> )
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: 'Explore',
					headerShown: false,
					tabBarIcon: ({ focused }) => ( <TabIcon focused={ focused } icon={ icons.search } title="Explore" /> )
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerShown: false,
					tabBarIcon: ({ focused }) => ( <TabIcon focused={ focused } icon={ icons.person } title="Profile" /> )
				}}
			/>
		</Tabs>
	)
}

export default TabsLayout