import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { colors } from "../theme/colors";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { setPreferences } from "../store/UserSlice";
import { savePreferences } from "../services/preferencesService";

const GENRES = ["Action", "Sci-Fi", "Drama", "Comedy", "Horror", "Adventure"];

export const PreferencesScreen = () => {
  const { email, preferences } = useAppSelector((state) => state.user);
  const [selected, setSelected] = useState<string[]>(preferences);
  const dispatch = useAppDispatch();

  const toggleGenre = (genre: string) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const save = async () => {
    dispatch(setPreferences(selected));
    await savePreferences(email, selected);
    alert("¡Gustos guardados!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tus géneros favoritos</Text>

      <FlatList
        data={GENRES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.genreBox,
              selected.includes(item) && styles.genreSelected,
            ]}
            onPress={() => toggleGenre(item)}
          >
            <Text style={styles.genreText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveText}>Guardar gustos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 22, color: colors.text, fontWeight: "bold", marginBottom: 20 },
  genreBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.surface,
    marginBottom: 10,
  },
  genreSelected: {
    backgroundColor: colors.secondary,
  },
  genreText: { fontSize: 18, color: colors.text },
  saveButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
  },
  saveText: { color: "#fff", textAlign: "center", fontSize: 18 },
});
