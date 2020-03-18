import React, { useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet
} from "react-native";
import { globalStyles } from "../styles/global";
import { LanguageContext } from "../shared/LanguageContext";
import { LoadingContext } from "../shared/LoadingContext";
import ButtonView from "./ButtonView";
import storage from "../utils/storage";
import requestPage from "../utils/requestPage";
import { Icon } from "react-native-elements";
import { Alert, ToastAndroid } from "react-native";
export default function CustomDrawer({ navigation }) {
  const { language, setLanguage } = useContext(LanguageContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const homeClick = page => () => {
    navigation.navigate(page);
    navigation.toggleDrawer();
  };

  const languageClick = languageSelected => () => {
    storage.setLanguageSetting(languageSelected);
    setLanguage(languageSelected);
    navigation.closeDrawer();
  };
  const checkUpdate = async () => {
    let data = await requestPage.fetchUpdatedContent(null);
    if (data.length === 0) {
      ToastAndroid.show("Data already up to date", ToastAndroid.SHORT);
    } else {
      let res = await storage.updateStoragePages(data);
      res === true && ToastAndroid.show("Data updated", ToastAndroid.SHORT);
      setLoading(true);
    }
  };
  const clearData = async () => {
    await storage.removeAllStoragePages();
    let info = await storage.checkStoragePages();
    if (info === false) {
      ToastAndroid.show("Local data cleared", ToastAndroid.SHORT);
      setLoading(true);
    }
  };
  const confirmClearDataClick = async () => {
    Alert.alert(
      "Confirm local data deletion",
      "Are you sure?",
      [
        { text: "YES", onPress: () => clearData() },
        {
          text: "NO",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  const confirmClearScoreClick = async idQuizz => {
    let result = await storage.getQuizScore(idQuizz);
    if (result) {
      Alert.alert(
        "Confirm local score deletion",
        "Current scores are: " + JSON.stringify(result),
        [
          { text: "YES", onPress: () => storage.deleteScoreData(idQuizz) },
          {
            text: "NO",
            style: "cancel"
          }
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/mountain.jpg")}
      style={globalStyles.mountainBackgroundImage}
    >
      <View style={globalStyles.drawerContainer}>
        <View style={globalStyles.drawerTop}>
          <TouchableOpacity onPress={homeClick("EResamont")}>
            <Text style={globalStyles.drawerTitle}>E-Res@mont</Text>
          </TouchableOpacity>
          <View style={globalStyles.drawerTopMenu}>
            <TouchableOpacity onPress={confirmClearDataClick}>
              <Text style={globalStyles.drawwerTopMenuText}>
                Clear local storage
              </Text>
              <View style={localStyles.topMenuDivider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={checkUpdate}>
              <Text style={globalStyles.drawwerTopMenuText}>
                Check for update
              </Text>
              <View style={localStyles.topMenuDivider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmClearScoreClick(95)}>
              <Text style={globalStyles.drawwerTopMenuText}>
                Clear lake louise data
              </Text>
              <View style={localStyles.topMenuDivider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmClearScoreClick(100)}>
              <Text style={globalStyles.drawwerTopMenuText}>
                Clear oxygen data
              </Text>
              <View style={localStyles.topMenuDivider} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={globalStyles.drawerButtons}>
          <ButtonView
            value="Français"
            style={globalStyles.drawerLanguageButton}
            onPress={languageClick(1)}
          />
          <ButtonView
            value="Italiano"
            style={globalStyles.drawerLanguageButton}
            onPress={languageClick(2)}
          />
          <ButtonView
            value="English"
            style={globalStyles.drawerLanguageButton}
            onPress={languageClick(3)}
          />
          <ButtonView
            value="Deutsch"
            style={globalStyles.drawerLanguageButton}
            onPress={() => alert("Translation coming soon")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
const localStyles = StyleSheet.create({
  topMenuDivider: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginTop: 5,
    marginBottom: 20
  }
});

//deleteScoreData
