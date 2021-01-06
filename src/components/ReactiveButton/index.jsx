import { Button } from 'ant-design-vue'

export default {
  name: 'ReactiveButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'default'
    },
    shape: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    ghost: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    errored: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    loadedText: {
      type: String,
      default: ''
    },
    erroredText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loaded: false,
      hasError: false
    }
  },
  computed: {
    computedType() {
      if (this.loaded) {
        return this.hasError ? 'danger' : this.type
      }
      return this.type
    },
    computedIcon() {
      if (this.loaded) {
        return this.hasError ? 'close-circle' : 'check-circle'
      }
      return this.icon
    },
    computedText() {
      if (this.loaded) {
        return this.hasError ? this.erroredText : this.loadedText
      }
      return this.text
    }
  },
  watch: {
    loading(value) {
      if (!value) {
        this.loaded = true
        if (this.errored) {
          this.hasError = true
        }
        setTimeout(() => {
          this.loaded = false
          this.hasError = false
          this.$emit('callback')
        }, 800)
      }
    }
  },
  render() {
    const onClick = () => {
      this.$emit('click')
    }
    return (
      <Button
        disabled={this.disabled}
        ghost={this.ghost}
        type={this.computedType}
        loading={this.loading}
        icon={this.computedIcon}
        size={this.size}
        shape={this.shape}
        tip={this.tip}
        onClick={onClick}
      >
        {this.computedText}
      </Button>
    )
  }
}
