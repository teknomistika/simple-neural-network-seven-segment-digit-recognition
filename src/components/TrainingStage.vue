<template>
  <konva-stage :config="stageSize">
    <konva-layer>
      <konva-circle :config="circleConfig" />
    </konva-layer>
  </konva-stage>
</template>

<script setup>


const stageSize = {
  width: 200,
  height: 200
};

const circleConfig = {
  x: 100,
  y: 100,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4
};
</script>