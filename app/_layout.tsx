import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import './global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [ fontsLoaded, error ] = useFonts({
		'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
		'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
		'Rubik-ExtraBold': require('../assets/fonts/Rubik-ExtraBold.ttf'),
		'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
		'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
		'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf')
	})

	useEffect(() => {
		if(fontsLoaded || error)
			SplashScreen.hideAsync()
	}, [fontsLoaded, error])

	if(!fontsLoaded && !error)
		return null

  return <Stack 
		screenOptions={{ headerShown: false }}
	/>;
}
