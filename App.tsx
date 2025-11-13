import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

type Course = "Starter" | "Main" | "Dessert";

interface MenuItem {
  dishName: string;
  description: string;
  course: Course;
  price: number;
}

const COURSES: Course[] = ["Starter", "Main", "Dessert"];

export default function App() {
  // Initial basic menu items for demonstration
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      dishName: "Tomato Soup",
      description: "Fresh tomatoes, herbs, and cream",
      course: "Starter",
      price: 45,
    },
    {
      dishName: "Grilled Chicken",
      description: "Succulent chicken with herbs and spices",
      course: "Main",
      price: 120,
    },
    {
      dishName: "Chocolate Brownie",
      description: "Rich chocolate brownie with ice cream",
      course: "Dessert",
      price: 55,
    },
  ]);

  const [view, setView] = useState<"home" | "add" | "filter">("home");

  // Form state for adding menu items
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course | "">("");
  const [price, setPrice] = useState<string>("");

  const [filter, setFilter] = useState<Course | "All">("All");

  function addMenuItem() {
    if (!dishName.trim() || !description.trim() || !course || !price) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Price must be a valid positive number.");
      return;
    }
    const newItem: MenuItem = {
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: priceNum,
    };
    setMenuItems((prev) => [...prev, newItem]);
    // Clear form and go home
    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");
    setView("home");
  }

  function removeItem(index: number) {
    setMenuItems((prev) => prev.filter((_, i) => i !== index));
  }

  function avgPriceByCourse(c: Course): string {
    const items = menuItems.filter((item) => item.course === c);
    if (items.length === 0) return "0.00";
    const total = items.reduce((sum, i) => sum + i.price, 0);
    return (total / items.length).toFixed(2);
  }

  const filteredItems =
    filter === "All" ? menuItems : menuItems.filter((item) => item.course === filter);

  // Component for each menu item card with optional remove button
  function MenuItemCard({
    item,
    index,
    showRemove,
  }: {
    item: MenuItem;
    index: number;
    showRemove: boolean;
  }) {
    return (
      <View style={styles.menuItem}>
        <View>
          <Text style={styles.menuDishName}>{item.dishName}</Text>
          <Text style={styles.menuCourse}>{item.course}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.menuPrice}>R{item.price.toFixed(2)}</Text>
        </View>
        {showRemove && (
          <TouchableOpacity
            style={styles.btnRemove}
            onPress={() =>
              Alert.alert(
                "Remove Item",
                `Remove "${item.dishName}" from menu?`,
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Remove", style: "destructive", onPress: () => removeItem(index) },
                ]
              )
            }
          >
            <Text style={styles.btnRemoveText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THE Chef’s Menu </Text>

      {/* Navigation */}
      <View style={styles.navRow}>
        <Button title="Home" onPress={() => setView("home")} disabled={view === "home"} />
        <Button title="Add Menu Item" onPress={() => setView("add")} disabled={view === "add"} />
        <Button title="Guest Filter" onPress={() => setView("filter")} disabled={view === "filter"} />
      </View>

      {/* Home Screen with FlatList and header */}
      {view === "home" && (
        <FlatList
          style={styles.menuList}
          data={menuItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <MenuItemCard item={item} index={index} showRemove={true} />
          )}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle}>Menu Overview</Text>
              <Text style={styles.text}>Total menu items: {menuItems.length}</Text>

              <View style={styles.avgPrices}>
                <Text style={[styles.text, styles.bold]}>Average Prices:</Text>
                {COURSES.map((c) => (
                  <Text key={c} style={styles.text}>
                    {c}s: R{avgPriceByCourse(c)}
                  </Text>
                ))}
              </View>

              {menuItems.length === 0 && (
                <Text style={styles.noItems}>No menu items added yet.</Text>
              )}
            </>
          }
        />
      )}

      {/* Add Menu Item Screen */}
      {view === "add" && (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Add New Menu Item</Text>

          <TextInput
            style={styles.input}
            placeholder="Dish Name"
            value={dishName}
            onChangeText={setDishName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={course}
              onValueChange={(val) => setCourse(val)}
              style={styles.picker}
              prompt="Select Course"
            >
              <Picker.Item label="Select Course" value="" />
              {COURSES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Price (R)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <View style={{ marginTop: 10 }}>
            <Button title="Add Item" onPress={addMenuItem} />
          </View>
        </View>
      )}

      {/* Guest Filter Screen */}
      {view === "filter" && (
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Guest Menu Filter</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filter}
              onValueChange={(val) => setFilter(val)}
              style={styles.picker}
              prompt="Filter by Course"
            >
              <Picker.Item label="All" value="All" />
              {COURSES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {filteredItems.length === 0 ? (
            <Text style={styles.noItems}>No menu items to display.</Text>
          ) : (
            <FlatList
              style={styles.menuList}
              data={filteredItems}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <MenuItemCard item={item} index={index} showRemove={false} />
              )}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5ea685ff",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#047857",
    marginBottom: 20,
    alignSelf: "center",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  menuList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
  },
  avgPrices: {
    marginBottom: 20,
  },
  noItems: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    alignSelf: "center",
  },
  menuItem: {
    backgroundColor: "#d1fae5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#bbf7d0",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuDishName: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 3,
  },
  menuCourse: {
    fontStyle: "italic",
    fontSize: 14,
    marginBottom: 5,
  },
  menuPrice: {
    fontWeight: "600",
    marginTop: 5,
  },
  btnRemove: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  btnRemoveText: {
    color: "white",
    fontWeight: "600",
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderColor: "#22c55e",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "white",
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderColor: "#22c55e",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
