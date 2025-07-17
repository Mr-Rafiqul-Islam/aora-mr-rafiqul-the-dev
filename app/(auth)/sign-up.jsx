import { View, ScrollView, Image, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { useState } from "react";
import FormField from "../../components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { checkActiveSession, createUser, deleteSessions } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const handleSubmit = async () => {
    if (
      formData.username === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
    }
    setIsSubmitting(true);

    try {
      // Check for an active session
      const activeSession = await checkActiveSession();

      if (activeSession) {
        // Delete the active sessions if one exists
        await deleteSessions();
      }
      const result = await createUser(
        formData.email,
        formData.password,
        formData.username
      );

      setUser(result);
      setIsLoggedIn(true);
      //  set it to global context later

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center h-full px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Sign Up to Aora
          </Text>

          <FormField
            title="Username"
            value={formData.username}
            placeholder="Enter Your Username"
            handleChangeText={(e) => setFormData({ ...formData, username: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Email"
            value={formData.email}
            placeholder="Enter Your Email"
            handleChangeText={(e) => setFormData({ ...formData, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={formData.password}
            placeholder="Enter Your Password"
            handleChangeText={(e) => setFormData({ ...formData, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title={"Sign Up"}
            handlePress={handleSubmit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-secondary font-psemibold text-lg"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
