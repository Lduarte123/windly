import React from "react";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "../../components/styles";
import MainSection from "../../components/mainSection/MainSection";
import SearchBar from "../../components/searchBar/SearchBar";
import MainStats from "../../components/mainStats/MainStats";

export default function App(){

    const [search, setSearch] = useState("");

    return(
        <ScrollView>
            <View style={styles.config}>
            <Text style={styles.fontConfig}>Configurações</Text>
            </View>
        </ScrollView>
        
    )
}