import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { categories } from '@/constants/data'

export const Filters = () => {
	const params = useLocalSearchParams<{filters?: string}>()
	const [selectedCategory, setSelectedCategory] = useState(params.filters || 'All')
	
	const handleCategory = (category: string) => {
		if(selectedCategory === category) {
			setSelectedCategory('All')
			router.setParams({ filter: 'All' })
			return
		}

		setSelectedCategory(category)
		router.setParams({ filter: category })
	}

	return (
		<ScrollView 
			horizontal
			showsHorizontalScrollIndicator={ false }
			className="mt-3 mb-2"
		>
			{
				categories.map((item, index) => (
					<TouchableOpacity 
						key={index}
						onPress={ () => handleCategory(item.category) }
						className={ `flex flex-col items-start mr-4 px-4 py-2 rounded-full
							${ selectedCategory === item.category 
								? 'bg-primary-300' 
								: 'border-t-primary-100 border border-primary-200' 
						}` }
					>
						<Text
							className={ 
								`text-sx ${ 
									selectedCategory === item.category 
									? 'text-white font-rubik-bold mt-0.5' 
									: 'text-black-300 font-rubik' }` 
							}
						>
							{ item.title }
						</Text>
					</TouchableOpacity>
				))
			}
		</ScrollView>
	)
}
