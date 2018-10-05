<template>
  <v-layout row wrap class="ma-2 pb-4 elevation-2" style="background: rgba(128, 128, 128, 0.14);">

    <v-layout style="overflow-x: auto; font-weight: 700; min-width: 1200px;" class="mx-2">
      <div class="px-2 py-3" style="flex: 1 1 auto; width: 3%;padding: 14px 4px 0;text-align: center;">
        <div class="pb-2" style="border-bottom:2px solid orange"> #</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto; width:15%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Item</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto; width:47%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Description</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto; width:12%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Unit Cost</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto;  width:10%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Quantity</div>
      </div>
      <div class="px-2 py-3" style="flex: 1 1 auto;  width:13%;">
        <div class="pb-2" style="border-bottom:2px solid orange"> Line Total</div>
      </div>
      <v-icon class="px-1 transparent--text mdi-18px">mdi-minus-circle</v-icon>

    </v-layout>

    <transition-group name="scale-transition" tag="div" style="width:100%">

      <v-layout v-for="(item, index) in childData.invoice_items" :key='index' style="overflow-x: auto;min-width: 1200px; "
        class="mx-2 py-2" @mouseover="item.overed=true" @mouseleave="item.overed=false">

        <div style="width: 3%;padding: 14px 4px 0;text-align: center;">{{index+1}}</div>
        <v-text-field label="Item" v-model="item.item" @input="updateLine($event, item)" solo hide-details flat
          class="px-2" style="width:15%;"></v-text-field>
        <v-text-field label="Description" v-model="item.description" @input="updateLine($event, item)" solo hide-details
          flat class="px-2" style="width:47%;"></v-text-field>
        <v-text-field label="Unit Cost" type="number" v-model="item.unit_cost" @input="updateLine($event, item)"
          solo hide-details flat class="px-2" style="width:12%;"></v-text-field>
        <v-text-field label="Quantity" type="number" v-model="item.quantity" @input="updateLine($event, item)"
          solo hide-details flat class="px-2" style="width:10%;"></v-text-field>
        <v-text-field label="Line Total" type="number" v-model="item.line_total" readonly solo hide-details flat
          class="px-2 align-right" style="width:13%;"></v-text-field>

        <v-icon @click="deleteLine(item.id)" :class="item.overed?'red--text':'transparent--text'" class="px-1 mdi-18px">mdi-minus-circle</v-icon>

      </v-layout>
    </transition-group>

    <v-layout row wrap style="width: 100%" class="pa-4">
      <v-btn @click="addNewLine()" dark color="orange"> New Line</v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  props: {
    form: { type: Object, required: false, default: {} }
  },
  data() {

    return {
      childData: {},
      emptyItem: {
        id: 0,
        item: '',
        description: '',
        unit_cost: (Math.random() * 100).toFixed(3),
        quantity: Math.floor(Math.random() * 100) + 1,
        line_total: 0,
        overed: false
      }

    }
  },
  beforeCreate() {

  },
  created() {
    this.childData = Object.assign({}, this.form)
    console.log(" this.childData================>", this.childData)
    this.addNewLine()
  },
  destroyed() {
  },
  beforeMount() {

  },
  mounted() {
    var vm = this;
    this.$root.$on("updateChilds", function (data) { vm.childData = Object.assign({}, data); vm.updateGrandTotal(true) });
  },
  methods: {
    addNewLine() {
      var newItem = Object.assign({}, this.emptyItem)
      newItem.id = this.childData.invoice_items.length + 1
      this.childData.invoice_items.push(newItem)
    },
    deleteLine(id) {
      var vm = this
      this.childData.invoice_items = this.childData.invoice_items.filter(function (obj) {
        return obj.id !== id;
      });
      this.updateGrandTotal();
      setTimeout(() => {
        if (vm.childData.invoice_items.length == 0) vm.addNewLine()
      }, 100);
    },
  

    updateLine: debounce(function (event, item) {
      var vm = this;
      item.line_total =parseFloat(( item.quantity * item.unit_cost).toFixed(3).replace(",", "."));

      vm.updateGrandTotal()
    }, 500),

    updateGrandTotal(oneTime = false) {
      var subtotal = 0
      for (var i = 0; i < this.childData.invoice_items.length; i++) {
        subtotal += this.childData.invoice_items[i].line_total
      }
      this.childData.totals.subtotal =  parseFloat((subtotal).toFixed(3).replace(",", "."));
      if (this.childData.is_amount_discount == 1) {
        this.childData.totals.discount = this.childData.discount;
      } else {
        this.childData.totals.discount = this.childData.discount * subtotal / 100;
      }
      this.childData.totals.discount = parseFloat((this.childData.totals.discount).toFixed(3).replace(",", "."));

      this.childData.totals.total = parseFloat((subtotal - this.childData.totals.discount).toFixed(3).replace(",", "."));

      if (!oneTime)
        this.$emit('interface', this.childData)
    }
  }
}
</script>
<style>
.align-right input {
  text-align: right;
}
</style>
