import React, {useCallback, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
  Dimensions,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Ocr, {OcrResult} from './src/modules/ocr';
import {WebView} from 'react-native-webview';

function App(): React.JSX.Element {
  const vw = useRef();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<OcrResult | undefined>();
  const [image, setImage] = React.useState<Asset | undefined>();

  const handleClick = useCallback(async () => {
    console.log('handleClick');
    launchImageLibrary({mediaType: 'photo'}, async ({assets}) => {
      if (!assets?.[0].uri) {
        throw new Error('oh!');
      }
      try {
        const res = await Ocr.detectFromUri(assets[0].uri);
        console.log('assets', assets);
        setImage(assets[0]);
        // console.log('res', JSON.stringify(res));
        const text = res?.reduce(
          (acc, item) =>
            acc +
            item.lines?.reduce((acc2, item2) => acc2 + item2.text, '') +
            '\n',
          '',
        );
        // const text = '다면한번이라도';
        console.log(text);
        setResult(res);
        // @ts-ignore
        vw.current?.injectJavaScript(
          "document.querySelector('#txtSource').value = `" + text + '`',
        );

        // @ts-ignore
        vw.current?.injectJavaScript(
          "Object.keys(document.querySelector('#txtSource')).some(key => { if(/^__reactEventHandlers/.test(key)){  document.querySelector('#txtSource')[key].onChange({target:{value: `" +
            text +
            '`} }) } })',
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const injectFun = `navigator.permissions={query:function(t){return new Promise((resolve) => {
  console.log('injectFun', t)
    const obj = new EventTarget()
    obj.name = t
    obj.state = "denied"
    obj.onchange = null
    resolve(obj)
  })}}`;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {/* <Text>loading: {loading.toString()}</Text> */}
          <Button title="上传图片" onPress={handleClick} />
        </View>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'stretch',
            padding: 20,
            height: Dimensions.get('window').height - 100,
          }}
          showsVerticalScrollIndicator
          style={styles.scroll}>
          <WebView
            ref={vw}
            allowFileAccessFromFileURLs={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccess={true}
            injectedJavaScriptBeforeContentLoaded={injectFun}
            source={{uri: 'https://papago.naver.com/'}}
            style={{height: Dimensions.get('window').height - 100}}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  scroll: {
    flex: 1,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 2,
  },
});

export default App;
