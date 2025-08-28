import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Keyboard,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AISearchBar = () => {
  const { dark } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { width } = Dimensions.get('window');
  const containerWidth = width - 32;

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (searchText.length === 0) {
        setIsExpanded(false);
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [searchText]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (searchText.length === 0) {
      setIsExpanded(false);
    }
  };

  const handleSearch = () => {
    console.log('Pesquisa:', searchText);
    Keyboard.dismiss();
    setIsExpanded(false);
  };

  const handleClear = () => {
    setSearchText('');
    setIsExpanded(false);
  };

  const handleSubmitEditing = () => {
    if (searchText.trim().length > 0) {
      handleSearch();
    }
  };

  // Altura fixa expandida (sem interpolação)
  const containerHeight = isExpanded ? 100 : 70;

  const animatedContainerStyle = {
    position: isExpanded ? 'absolute' : 'relative',
    top: isExpanded ? 170 : 0,
    left: isExpanded ? 16 : 0,
    right: isExpanded ? 16 : 0,
    zIndex: isExpanded ? 1000 : 1,
    width: isExpanded ? width - 32 : containerWidth,
    height: containerHeight,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        animatedContainerStyle,
        {
          backgroundColor: dark ? '#2a2a2a' : '#ffffff',
          borderColor: dark ? '#404040' : '#e0e0e0',
        },
      ]}
    >
      <View style={styles.searchContainer}>
        <Ionicons
          name="sparkles"
          size={20}
          color={dark ? '#99e2ff5e' : '#1313133f'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: dark ? '#ECEDEE' : '#11181C',
              backgroundColor: dark ? '#2a2a2a' : '#ffffff',
            },
          ]}
          placeholder="digite para a ia responder"
          placeholderTextColor={dark ? '#888888' : '#999999'}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (text.length > 0 && !isExpanded) {
              setIsExpanded(true);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          onKeyPress={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          returnKeyType="search"
          multiline={false}
          scrollEnabled={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons
              name="close-circle"
              size={20}
              color={dark ? '#888888' : '#999999'}
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          {
            backgroundColor: searchText.length > 0 ? '#6e7ef5ff' : '#cccccc',
          },
        ]}
        onPress={handleSearch}
        disabled={searchText.length === 0}
      >
        <Ionicons name="send" size={18} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontFamily: 'System',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default AISearchBar;
