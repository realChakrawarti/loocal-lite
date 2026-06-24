import { localAuthenticate } from "@/shared/local-authenticate";
import log from "@/shared/logger";
import { useRouter } from "expo-router";
import { Spinner } from "heroui-native/spinner";
import { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Button, cn } from "heroui-native";
import { FontAwesome6 } from "@expo/vector-icons";

enum AuthenticatedState {
  pending,
  success,
  failed,
}

export default function SplashScreen() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<AuthenticatedState>(
    AuthenticatedState.pending
  );

  const handleLocalAuthentication = useCallback(() => {
    localAuthenticate()
      .then(() => {
        setAuthenticated(AuthenticatedState.success);
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 1500);
      })
      .catch((err) => {
        setAuthenticated(AuthenticatedState.failed);
        log.error(err);
      });
  }, [router]);

  useEffect(() => {
    handleLocalAuthentication();
  }, [handleLocalAuthentication]);

  const logo = require("../../assets/images/splash-icon.png");

  return (
    <View className="items-center justify-center flex-1">
      <View className="gap-2 items-center ">
        <Image
          contentPosition="bottom center"
          source={logo}
          style={{ width: 200, height: 100 }}
          contentFit="contain"
        />
        <Text className="text-[#6e6e6eaa] text-base tracking-wide font-bold">
          Manage contacts, locations and notes
        </Text>
        <Spinner
          className={cn(authenticated === AuthenticatedState.pending ? "opacity-100" : "opacity-0")}
          size="lg"
          color="default"
        >
          <Spinner.Indicator animation={{ rotation: { speed: 1 } }} />
        </Spinner>
      </View>
      <View className="absolute bottom-1/5">
        {authenticated === AuthenticatedState.failed ? (
          <Button
            className="flex flex-col size-auto gap-2 items-center"
            variant="ghost"
            onPress={() => {
              setAuthenticated(AuthenticatedState.pending);
              handleLocalAuthentication();
            }}
          >
            <View className="size-18 justify-center items-center rounded-full border border-[#6e6e6eaa]">
              <FontAwesome6 name="fingerprint" size={40} color="#6e6e6eaa" />
            </View>
            <Text className="text-[#6e6e6eaa] tracking-wide">Authenticate</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
