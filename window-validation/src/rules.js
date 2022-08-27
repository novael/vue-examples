const required = (v) => {
  return !!v || "This field is required"
}

const passwordMatch = (pw) => {
  return (v) => v == pw || 'The password must match'
}

const email = (v) => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      
  return pattern.test(v) || 'Invalid e-mail.'
}

export { required, passwordMatch, email };