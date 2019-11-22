import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { fireworks, snow } from '../../animate/index';
import image1 from './images/1.jpg'
import image2 from './images/2.jpg'
import image3 from './images/3.jpg'
import image4 from './images/4.jpg'
import image5 from './images/5.jpg'
import image6 from './images/6.jpg'



import './index.less'


@inject('counterStore')

@observer
class Index extends Component {

  
  componentWillMount () { }

  

  componentDidMount () {
    fireworks.start() 
    snow.start()
  }

  componentWillUnmount () { }

  componentWillReact () {
    console.log('componentWillReact')
  }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页'
  }


  render () {
    return (
      <View className='index'>
         <View className='slider'>
            <View className='x_rot'>
                <View className='y_rot'>
                    <Image id='i1' src={image1}></Image>
                    <Image id='i2' src={image2}></Image>
                    <Image id='i3' src={image3}></Image>
                    <Image id='i4' src={image4}></Image>
                    <Image id='i5' src={image5}></Image>
                    <Image id='i6' src={image6}></Image>
                </View>
            </View>
        </View>
      </View>
    )
  }
}

export default Index 
