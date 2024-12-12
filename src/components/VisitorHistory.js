import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const VisitorScreen = () => {
  const [visitors, setVisitors] = useState([]);
  const [editingVisitorId, setEditingVisitorId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://192.168.12.101:9090/visitors", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setVisitors(result.data);
      })
      .catch((error) => console.error("Error fetching visitors:", error));
  }, []);

  const startEditing = (visitor) => {
    setEditingVisitorId(visitor.id);
    setEditedDetails(visitor);
  };

  const saveChanges = () => {
    const { phone, name, last_address } = editedDetails;

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        name,
        last_address,
      }),
    };

    fetch(`http://192.168.12.101:9090/visitors/update/${editingVisitorId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.message);
        // Update the visitor list locally after successful update
        const updatedVisitors = visitors.map((visitor) =>
          visitor.id === editingVisitorId ? { ...visitor, ...editedDetails } : visitor
        );
        setVisitors(updatedVisitors);
        setEditingVisitorId(null);
      })
      .catch((error) => console.error("Error updating visitor:", error));
  };

  const deleteVisitor = (id) => {
    Alert.alert(
      "Delete Visitor",
      "Are you sure you want to delete this visitor?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const requestOptions = {
              method: "DELETE",
              redirect: "follow",
            };

            fetch(`http://192.168.12.101:9090/visitors/${id}`, requestOptions)
              .then((response) => response.text())
              .then(() => {
                const updatedVisitors = visitors.filter((visitor) => visitor.id !== id);
                setVisitors(updatedVisitors);
              })
              .catch((error) => console.error("Error deleting visitor:", error));
          },
        },
      ]
    );
  };

  const renderVisitor = ({ item }) => {
    if (item.id === editingVisitorId) {
      return (
        <View style={styles.visitorItem}>
          <TextInput
            style={styles.input}
            value={editedDetails.name}
            onChangeText={(text) =>
              setEditedDetails({ ...editedDetails, name: text })
            }
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={editedDetails.phone}
            onChangeText={(text) =>
              setEditedDetails({ ...editedDetails, phone: text })
            }
            placeholder="Phone"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={editedDetails.last_address}
            onChangeText={(text) =>
              setEditedDetails({ ...editedDetails, last_address: text })
            }
            placeholder="Address"
          />
          <Button title="Save" onPress={saveChanges} />
        </View>
      );
    }

    return (
      <View style={styles.visitorItem}>
        <View style={styles.imageContainer}>
          <Image
            source={require("./assets/images/profile_logo.png")}
            style={styles.visitorImage}
            defaultSource={require("./assets/images/profile_logo.png")}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Name: {item.name}</Text>
          <Text style={styles.text}>Phone: {item.phone}</Text>
          <Text style={styles.text}>Address: {item.last_address}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => startEditing(item)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteVisitor(item.id)} // Trigger alert before delete
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Visitor List</Text>
        <FlatList
          data={visitors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVisitor}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#303A52",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  visitorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    flex: 1,
    marginRight: 10,
  },
  visitorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    flex: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  editButton: {
    backgroundColor: "#FFC300",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#FF4136",
    padding: 10,
    borderRadius: 5,
  },
  editText: {
    color: "#fff",
    textAlign: "center",
  },
  deleteText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default VisitorScreen;
