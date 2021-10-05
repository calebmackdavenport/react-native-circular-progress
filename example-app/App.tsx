import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, PanResponder, PanResponderInstance } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const MAX_POINTS = 500;

export default function App() {

  const [points, setPoints] = useState<number>(325);
  const [pointsDelta, setPointsDelta] = useState<number>(0);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const fill = (points / MAX_POINTS) * 100;

  const circularProgressRef: React.RefObject<AnimatedCircularProgress> = React.createRef();
  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => true,
    onStartShouldSetPanResponderCapture: (_, gestureState) => true,
    onMoveShouldSetPanResponder: (_, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (_, gestureState) => true,
    onPanResponderGrant: (_, gestureState) => {
      setIsMoving(true);
      setPointsDelta(0);
    },
    onPanResponderMove: (_, gestureState) => {
      circularProgressRef.current && circularProgressRef.current.animate(0, 0);
      // For each 2 pixels add or subtract 1 point
      setPointsDelta(Math.round(-gestureState.dy / 2));
    },
    onPanResponderTerminationRequest: (_, gestureState) => true,
    onPanResponderRelease: (_, gestureState) => {
      circularProgressRef.current && circularProgressRef.current.animate(100, 3000);
      let combinedPoints = points + pointsDelta;
      let clampedPoints = Math.max(Math.min(combinedPoints, MAX_POINTS), 0);
      setIsMoving(false);
      setPoints(clampedPoints);
      setPointsDelta(0);
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.container} {...panResponder.panHandlers}>
        <AnimatedCircularProgress
          size={200}
          width={3}
          backgroundWidth={30}
          fill={fill}
          tintColor="#00e0ff"
          backgroundColor="#3d5875"
          delay={250}
        >
          {fill => <Text style={styles.points}>{Math.round((MAX_POINTS * fill) / 100)}</Text>}
        </AnimatedCircularProgress>

        <AnimatedCircularProgress
          size={120}
          width={15}
          backgroundWidth={5}
          fill={fill}
          tintColor="#00ff00"
          tintColorSecondary="#ff0000"
          backgroundColor="#3d5875"
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
          delay={250}
        />

        <AnimatedCircularProgress
          size={100}
          width={25}
          fill={0}
          tintColor="#00e0ff"
          onAnimationComplete={() => console.log('onAnimationComplete')}
          ref={circularProgressRef}
          backgroundColor="#3d5875"
          arcSweepAngle={180}
          delay={250}
        />

        <Text style={[styles.pointsDelta, isMoving && styles.pointsDeltaActive]}>
          {pointsDelta >= 0 && `+ ${pointsDelta}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  points: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 50,
    fontWeight: '100',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#152d44',
    padding: 50,
  },
  pointsDelta: {
    color: '#4c6479',
    fontSize: 50,
    fontWeight: '100',
  },
  pointsDeltaActive: {
    color: '#fff',
  },
});
