import React, { useEffect, useState } from "react";
import { Headline, List, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles.js";

export default function SongsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(
        "https://rostov-gateway.herokuapp.com/songs/"
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView styles={styles.container}>
      <Headline> Songs </Headline>
      {content(isLoading, data)}
    </SafeAreaView>
  );
}

function content(isLoading, data) {
  if (isLoading) {
    return <ActivityIndicator></ActivityIndicator>;
  } else {
    return mapData(data);
  }
}

function mapData(data) {
  return Object.entries(data).map(([key, value]) => {
    console.log(key);
    console.log(value);
    return (
      <List.Item
        title={value.name}
        description={"by " + value.artist_name}
        key={key}
      />
    );
  });
}
