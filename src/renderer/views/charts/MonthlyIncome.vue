

<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['data'],
  mounted () {
    this.renderChart(this.data, this.options)
  },
    mounted () {
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: this.data
        }
      ]
    }, {responsive: true, maintainAspectRatio: false})
  }
}
</script>
