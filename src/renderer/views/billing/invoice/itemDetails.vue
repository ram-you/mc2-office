<template>
  <div id="billing-container" class="billing-container my-2 page">

    <div class="clearfix header" style="padding: 0 0 20px;">
      <div id="logo">
        <img :src="base64">
      </div>
      <div id="company">
        <h2 class="name">MEDIACEPT Technology</h2>
        <div>Boulevard des Palmiers, Sousse-Khézama, Sousse</div>
        <div>+216 73 274 987</div>
        <div>
          <a href="mailto:contact@mediacept.com">contact@mediacept.com</a>
        </div>
      </div>

    </div>
    <div style="padding: 0 0 0px;  padding-bottom: 40px; ">

      <div id="details" class="clearfix">
        <div id="client">
          <div class="to">INVOICE TO:</div>
          <h2 class="name">{{invoice.client.name}}</h2>
          <div class="address">{{invoice.client.address1}} {{invoice.client.address2}} {{invoice.client.city}} {{invoice.client.state}}
            {{invoice.client.postal_code}}
          </div>
          <div class="email">
            <a :href="'mailto:'+invoice.client.contact.email">{{invoice.client.contact.email}}</a>
          </div>
        </div>
        <div id="invoice">
          <h1>INVOICE {{invoice.invoice_number}}</h1>
          <div class="date">Date of Invoice: {{invoice.invoice_date}}</div>
          <div class="date">Due Date: {{invoice.due_date}}</div>
        </div>
      </div>
      <table border="0" cellspacing="0" cellpadding="0" style="padding-bottom: 40px;">
        <!-- === -->
        <thead>

          <tr>
            <th class="no">#</th>
            <th class="item">ARTICLE</th>
            <th class="desc">DESCRIPTION</th>
            <th class="unit">UNIT PRICE</th>
            <th class="qty">QUANTITY</th>
            <th class="total">TOTAL</th>
          </tr>

        </thead>
        <!-- === -->
        <tbody>

          <tr v-for="(item,index) in invoice.invoice_items " :key="index">
            <td class="no">{{index+1}}</td>
            <td class="item"> {{item.item}}</td>
            <td class="desc"> {{item.description}}</td>
            <td class="unit">{{item.unit_cost}}</td>
            <td class="qty">{{item.quantity}}</td>
            <td class="total">{{item.line_total}}</td>
            
          </tr>

        </tbody>

        <!-- === -->
        <tfoot>
          <tr>
            <td colspan="3"></td>
            <td colspan="2">SUBTOTAL</td>
            <td>{{invoice.totals.subtotal}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="2">TAX 25%</td>
            <td>$1,300.00</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="2">GRAND TOTAL</td>
            <td>{{invoice.totals.total}}</td>
          </tr>
        </tfoot>
        <!-- === -->

      </table>

      <div id="thanks">Thank you!</div>
      <div id="notices">
        <div>NOTICE:</div>
        <div class="notice">A finance charge of 1.5% will be made on unpaid balances after 30 days.</div>
      </div>
    </div>
    <footer>
      Invoice was created on a computer and is valid without the signature and seal.
    </footer>

   

  </div>
</template>
<script>
const Store = require('electron-store');
const _store = new Store();



export default {
  props: {
    invoiceData: { type: Object, required: false, default: {} }
  },
  data() {
    return {
      pages: Array(4),
      url2pdf: false,
      theme: 'default',
      logoImg: require("../../../../common/assets/img/logo/256x256.png"),
      base64: '',
      invoice: {}
    }
  },
  computed: {
    connectedUserName() { return this.$store.state.User.user ? this.$store.state.User.user.username : null; },

  },
  watch: {
    invoiceData() {
      this.invoice = Object.assign({}, this.invoiceData)
    },



  },
  beforeMount() {
    this.invoice = Object.assign({}, this.invoiceData)
  },
  mounted() {
    var vm = this

    var connectedUserName = this.connectedUserName;
    var invoiceUserTheme = _store.get('users.' + connectedUserName + '.invoice.theme') || 'default'
    this.theme = invoiceUserTheme
    require("../../../../common/assets/billing/theme/" + invoiceUserTheme + "/index.css")
    this.generateBase64()

   

  },
  methods: {
    splitArray(arr, n) {
      var res = [];
      while (arr.length) {
        res.push(arr.splice(0, n));
      }
      return res;
    },
    generateBase64() {
      let canvas = document.createElement('CANVAS')
      let img = document.createElement('img')
      img.src = this.logoImg
      img.onload = () => {
        canvas.height = img.height
        canvas.width = img.width
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        this.base64 = canvas.toDataURL('image/png')
        canvas = null
      }

      img.onerror = error => {
        this.error = 'Could not load image, please check that the file is accessible and an image!'
      }
    },



  },

}

</script> 

