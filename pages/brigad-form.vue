<template>
  <v-layout column justify-center align-center>
    <v-flex xs6 class="fullwidth">
      <v-row>
        <v-col>
          <v-text-field label="Time finished" v-model="time"></v-text-field>
          <v-text-field label="Did you do this?" v-model="yes"></v-text-field>
          <v-text-field label="Did you clean after?"></v-text-field>
          <v-text-field label="What you did?"></v-text-field>
          <v-select :items="items" label="Was client satisfied?"></v-select>
          <v-file-input multiple chips label="Upload photos"></v-file-input>
          <canvas id="sheet" ref="sheet" width="300" height="200"></canvas>
          <v-btn>speichern</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col></v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      time: "",
      yes: "",
      items: ["Completly", "Not perfect", "Need to claim!"]
    };
  },
  mounted() {
    if (process.client) {
      var context = this.$refs["sheet"].getContext("2d");
      var canvas = this.$refs["sheet"];
      context = canvas.getContext("2d");
      context.strokeStyle = "#000";
      context.lineJoin = "round";
      context.lineWidth = 5;

      var clickX = [];
      var clickY = [];
      var clickDrag = [];
      var paint;

      /**
       * Add information where the user clicked at.
       * @param {number} x
       * @param {number} y
       * @return {boolean} dragging
       */
      function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
      }

      /**
       * Redraw the complete canvas.
       */
      function redraw() {
        // Clears the canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        for (var i = 0; i < clickX.length; i += 1) {
          if (!clickDrag[i] && i == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
          } else if (!clickDrag[i] && i > 0) {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
          } else {
            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
          }
        }
      }

      /**
       * Draw the newly added point.
       * @return {void}
       */
      function drawNew() {
        var i = clickX.length - 1;
        if (!clickDrag[i]) {
          if (clickX.length == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
          } else {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
          }
        } else {
          context.lineTo(clickX[i], clickY[i]);
          context.stroke();
        }
      }

      function mouseDownEventHandler(e) {
        paint = true;
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        if (paint) {
          addClick(x, y, false);
          drawNew();
        }
      }

      function touchstartEventHandler(e) {
        paint = true;
        if (paint) {
          addClick(
            e.touches[0].pageX - canvas.offsetLeft,
            e.touches[0].pageY - canvas.offsetTop,
            false
          );
          drawNew();
        }
      }

      function mouseUpEventHandler(e) {
        context.closePath();
        paint = false;
      }

      function mouseMoveEventHandler(e) {
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        if (paint) {
          addClick(x, y, true);
          drawNew();
        }
      }

      function touchMoveEventHandler(e) {
        if (paint) {
          addClick(
            e.touches[0].pageX - canvas.offsetLeft,
            e.touches[0].pageY - canvas.offsetTop,
            true
          );
          drawNew();
        }
      }

      function setUpHandler(isMouseandNotTouch, detectEvent) {
        removeRaceHandlers();
        if (isMouseandNotTouch) {
          canvas.addEventListener("mouseup", mouseUpEventHandler);
          canvas.addEventListener("mousemove", mouseMoveEventHandler);
          canvas.addEventListener("mousedown", mouseDownEventHandler);
          mouseDownEventHandler(detectEvent);
        } else {
          canvas.addEventListener("touchstart", touchstartEventHandler);
          canvas.addEventListener("touchmove", touchMoveEventHandler);
          canvas.addEventListener("touchend", mouseUpEventHandler);
          touchstartEventHandler(detectEvent);
        }
      }

      function mouseWins(e) {
        setUpHandler(true, e);
      }

      function touchWins(e) {
        setUpHandler(false, e);
      }

      function removeRaceHandlers() {
        canvas.removeEventListener("mousedown", mouseWins);
        canvas.removeEventListener("touchstart", touchWins);
      }

      canvas.addEventListener("mousedown", mouseWins);
      canvas.addEventListener("touchstart", touchWins);
    }
  }
};
</script>

<style>
#sheet {
  border: 1px solid black;
}
</style>
