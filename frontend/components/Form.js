import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
  toppingsRequired: 'toppings is required',
  toppingsType: 'toppings must be an array of IDs',
  toppingInvalid: 'topping ID invalid',
  toppingRepeated: 'topping IDs cannot be repeated'
}

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup
    .string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
  toppings: yup
    .array().of(
    yup.number().typeError(validationErrors.toppingsType)
          .integer(validationErrors.toppingsType)
          .min(1, validationErrors.toppingInvalid)
          .max(5, validationErrors.toppingInvalid))

})



// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  
  const [values, setValues] = useState({
    fullName: "",
    size: "",
    toppings: []
  })
  const [errors, setErrors] = useState({
    fullName: '',
    size: ''
  })
  const [enabled, isEnabled] = useState(false)
  const [success, setSuccess] = useState('')
  const [failure, setFailure] = useState('')

  const handleSubmit = (evt) => {
    evt.preventDefault()
    console.log(values)
    axios.post('http://localhost:9009/api/order', values)
          .then(res => {
            setSuccess(res.data.message)
            setFailure('')
          })
          .catch(err => {
            setFailure(err.response.data.message)
            setSuccess('')
          })
    
  }

  const handleChange = (evt) => {
    let { type, checked, name, value } = evt.target;

    let newValues = {...values}

    if (type === "checkbox") {
      value = checked

      if (value) {
        newValues.toppings = [...newValues.toppings, name]
      } else {
        newValues.toppings.filter(topping => topping === name)
      }
    } else {
      newValues[name] = value
    }

    setValues(newValues);
    // The ".reach()/.validate()" combination allows you to check a single value
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        // If value is valid, the corresponding error message will be deleted
        setErrors({ ...errors, [name]: "" });
      })
      .catch((err) => {
        // If invalid, we update the error message with the text returned by Yup
        // This error message was hard-coded in the schema
        setErrors({ ...errors, [name]: err.errors[0] });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" name="fullName" onChange={handleChange}/>
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" onChange={handleChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {
          toppings.map(tops => (
            <label key={tops.topping_id}>
              <input onChange={handleChange}
                name={tops.topping_id}
                type="checkbox"
              /> {tops.text}<br/>
            </label>
          ))
        }
        
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" />
    </form>
  )
}
