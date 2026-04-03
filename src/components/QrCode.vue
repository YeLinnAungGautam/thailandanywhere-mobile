<template>
  <div>
    <canvas ref="qrCanvas"></canvas>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  props: {
    id: {
      type: String,
      required: false,
    },
    crm_id: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      default: 150,
    },
    type: {
      type: String,
      default: "confirm",
    },
    color: {
      type: String,
      default: "#000000", // Default black color for QR code
    },
  },
  mounted() {
    let url = "";
    if (this.type == "confirm") {
      url = `https://thanywhere.com/ticket-checker/${this.id}?language=myanmar`;
    } else {
      url = `https://thanywhere.com/scan/${this.id}/${this.crm_id}`;
    }
    const canvas = this.$refs.qrCanvas;

    // Options with custom colors
    const options = {
      width: this.size,
      color: {
        dark: this.color, // Color of the QR code squares
      },
    };

    QRCode.toCanvas(canvas, url, options, (error) => {
      if (error) console.error("QR Code generation error:", error);
    });
  },
};
</script>
