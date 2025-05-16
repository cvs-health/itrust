/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { Avatar, Box, Icon, styled } from '@mui/material'

// Creates a styled icon in the background
export const BackgroundIcon = styled(Icon)(( props) => ({
    position: "absolute",
    color: props.color || 'white',
    right: props.right || 0,
    bottom: props.bottom || 10,
    fontSize: props.fontSize || 100,
    opacity: props.opacity || 0.2, 
}))

export const BackgroundImage = styled(Box)(( props) => ({
    position: "absolute",
    backgroundImage : `url(${props.path})`,
    backgroundSize: 'cover',
    right: props.right || 0,
    bottom: props.bottom || 0,
    width: props.width || 100,
    height: props.height || 100,
    fontSize: props.fontSize || 100,
    opacity: props.opacity || 0.2, 
}))


// Creates a styled box with a background image
export const BackgroundBox = styled(Box)(( props) => ({
    position: "absolute",
    backgroundImage : `url(${props.path})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: props.height || 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.color || 'white',
    fontSize: props.fontSize || 100,
    opacity: props.opacity || 0.2, 
    
}))
