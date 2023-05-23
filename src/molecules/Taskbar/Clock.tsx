// A windows 95 style taskbar clock, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Pressable } from "react-native";
import { Text } from "react95-native";
import { format } from "date-fns";

export interface ClockProps {
  onPress?: () => void;
}

export default function Clock(props: ClockProps) {
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formateDate = (date: Date) => {
    const timestamp = new Date(date);
    const formattedTimestamp = format(timestamp, "HH:mm");
    return formattedTimestamp;
  };

  const styles = StyleSheet.create({
    clockText: {},
  });

  return (
    <Pressable onPress={props.onPress}>
      <Text style={styles.clockText}>{formateDate(date)}</Text>
    </Pressable>
  );
}
