import React from "react";
import {
  View,
  Button,
  FlatList,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as firebase from "firebase";

export default function App() {
  const firebaseConfig = {
	  apiKey: "AIzaSyDtONWGBmy7cuH7Y1t2y3yADa_R_5yCtkU",
    projectId: "reactnative-275502",
    authDomain: "reactnative-275502.firebaseapp.com",
    databaseURL: "https://reactnative-275502.firebaseio.com/",
    storageBucket: "reactnative-275502.appspot.com",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  React.useEffect(() => {
    loadData();
  }, []);

  const [list, setList] = React.useState({
    newList: [],
    value: "",
    id: null,
    deleteId: null,
    updateValue: "",
  });

  async function sendData() {
    if (list.value != "") {
    firebase
      .database()
      .ref("/Note/note" + (list.newList.length + 1))
      .set({
        id: list.newList.length + 1,
        note: list.value,
      })
      .then(loadData);
    }else{
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  async function loadData() {
    console.disableYellowBox = true;
    firebase
      .database()
      .ref("Note")
      .once("value", function (snapshot) {
        var returnArray = [];

        snapshot.forEach(function (snap) {
          var item = snap.val();
          item.key = snap.key;

          returnArray.push(item);
        });
        setList({
          newList: returnArray,
        });
        return returnArray;
      });
  }

  async function updateData() {
    if (list.id != null && list.updateValue != "") {
      firebase
        .database()
        .ref("/Note/note" + list.id)
        .update({ note: list.updateValue })
        .then(loadData);
    } else {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  async function deleteData() {
    if (list.deleteId != null) {
      firebase
        .database()
        .ref("/Note/note" + list.deleteId)
        .remove()
        .then(loadData);
    } else {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
	  <Text style={styles.txtTitle}>DEMO REALTIME DATABASE</Text>
        {/* Phần Thêm Data */}
        <TextInput
          style={styles.input}
          placeholder="Nhập Note mới..."
          onChangeText={(text) => (list.value = text)}
          underlineColorAndroid="#F00"
        />

        <Button title="Gửi Note" onPress={sendData} />

        {/* Phần Update Data */}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nhập id..."
          onChangeText={(text) => (list.id = Number(text))}
          underlineColorAndroid="#F00"
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập Note muốn chỉnh sửa..."
          onChangeText={(text) => (list.updateValue = text)}
          underlineColorAndroid="#F00"
        />

        <Button title="Chỉnh sửa Note" onPress={updateData} />

        {/* Phần Xóa Data */}
        <TextInput
          style={styles.input}
          placeholder="Nhập id..."
          onChangeText={(text) => (list.deleteId = Number(text))}
          underlineColorAndroid="#F00"
        />

        <Button title="Xóa Note" onPress={deleteData} />

        <FlatList
          key={list.newList.length}
          data={list.newList}
          renderItem={({ item }) => (
            <Text>
              id: {item.id} - Note: {item.note}
            </Text>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50,
  },
  input: {
    fontSize: 18,
    marginVertical: 10,
  },
  
  txtTitle: {
    fontSize: 18,
    color: "#F00",
  },
});
