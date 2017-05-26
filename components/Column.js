import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/main';

// Takes props and returns a masonry column
export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: _resizeImages(this.props.data, this.props.parentDimensions, this.props.columns, this.props.gutter)
    };
  }

  componentWillReceiveProps(nextProps) {
     this.setState({
	      images: _resizeImages(nextProps.data, nextProps.parentDimensions, nextProps.columns, nextProps.gutter)
      });
  }

  render() {
    return (
      <View
        style={styles.masonry__column}>
          {_renderBricks(this.state.images, this.props.contentPadding)}
      </View>
    )
  }
}

// Transforms an array of images with dimensions scaled according to the
// column it is within
// _resizeImages :: Data, nColumns, parentDimensions -> ResizedImage
export function _resizeImages (data, parentDimensions, nColumns, gutter) {
  return Object.keys(data).map((key) => {
    const image = data[key];
      const imageSizedForColumn =
        _resizeByColumns(data[key].dimensions, parentDimensions, nColumns, gutter);
      // Return a image object that width will be equivilent to
      // the column dimension, while retaining original image properties
      return {
	       ...image,
	       ...imageSizedForColumn
      };
    });
}
// Resize image while maintain aspect ratio
// _resizeByColumns :: ImgDimensions , parentDimensions, nColumns  -> AdjustedDimensions
export function _resizeByColumns (imgDimensions, parentDimensions, nColumns = 2, gutter = 10) {
  const { height, width } = parentDimensions;

  // Column gutters are shared between right and left image
  const columnWidths = (width / nColumns) - (gutter / 2);
  const divider = imgDimensions.width / columnWidths;

  const newWidth = imgDimensions.width / divider;
  const newHeight = imgDimensions.height / divider;

  return { width: newWidth, height: newHeight, gutter };
}

// Renders the "bricks" within the columns
// _renderBricks :: [images] -> [TouchableTag || ImageTag...]
export function _renderBricks (images, contentPadding) {
  return images.map((image, index) => {
    // Avoid margins for first element
    const gutter = (index === 0) ? 0 : image.gutter;
    const brick = (image.onPress) ? _getTouchableUnit(image, gutter, contentPadding) : _getImageTag(image, gutter, contentPadding);
    return brick;
  });
}

// _getImageTag :: Image, Gutter -> ImageTag
export function _getImageTag (image, gutter = 0, contentPadding = 0) {
  return (
      <View key={image.uri} style={{ width: image.width, height: image.height + contentPadding, marginTop: gutter }}>
        <Image
          source={{ uri: image.uri }}
          resizeMethod='auto'
          style={{ width: image.width, height: image.height }}
        />
        {image.content}
      </View>
  );
}

// _getTouchableUnit :: Image, Number -> TouchableTag
export function _getTouchableUnit (image, gutter = 0, contentPadding = 0) {
  return (
      <TouchableOpacity
         key={image.uri}
         onPress={() => image.onPress(image)}>
            { _getImageTag(image, gutter, contentPadding) }
      </TouchableOpacity>
  );
}
