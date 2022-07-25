import React, { Component } from 'react';
import { FormBuilder, FormGenerator, Validators } from 'react-reactive-form';
import { Button } from 'reactstrap';

// Input component
const TextInput = ({ handler, touched, hasError, meta }) => (
  <div className="form-group">
    <label>{meta.label}</label>
    <input
      className="form-control"
      type={meta.type}
      placeholder={`Enter ${meta.label}`}
      {...handler()}
    />
    <span>{touched && hasError('required') && `${meta.label} is required`}</span>
  </div>
);

// Checkbox component
const CheckBox = ({ handler }) => (
  <div className="form-group">
    <input {...handler('checkbox')} />
    <label>&nbsp;&nbsp;I agree to the terms and condition.</label>
  </div>
);

// Radio component
const RadioSelect = ({ handler }) => (
  <div className="form-group">
    <div>
      <label>Gender:</label>
    </div>
    <div className="radioContainer">
      <div>
        <input {...handler('radio', 'male')} />
        <label>Male</label>
      </div>
      <div>
        <input {...handler('radio', 'female')} />
        <label>Female</label>
      </div>
      <div>
        <input {...handler('radio', 'other')} />
        <label>Other</label>
      </div>
    </div>
  </div>
);

const TextArea = ({ handler }) => (
  <div>
    <div>
      <label>Notes:</label>
    </div>
    <div>
      <textarea className="form-control" {...handler()} />
    </div>
  </div>
);

const SelectBox = ({ handler }) => (
  <div className="form-group">
    <label>Nationality:</label>
    <select className="form-control" {...handler()}>
      <option value="" disabled>
        Select
      </option>
      <option value="us">US</option>
      <option value="uk">UK</option>
      <option value="india">India</option>
      <option value="china">China</option>
    </select>
  </div>
);

// // Creates the unique keys
// const getKey = () => {
//   return this.keyCount++;
// };
// // Adds an item in Form Array
// const addItem = () => {
//   const itemsControl = this.productForm.get("items");
//   itemsControl.push(this.createItem());
// };

// Removes an item
const removeItem = (index) => {
  const itemsControl = this.productForm.get('items'); // as FormArray;
  itemsControl.removeAt(index);
};

const createItem = () => {
  const control = FormBuilder.group({
    name: '',
    description: '',
    price: ''
  });
  // Adding key
  control.meta = {
    key: this.getKey()
  };
  return control;
};

function handleSubmit(e) {
  e.preventDefault();
  // alert(`You submitted \n ${JSON.stringify(this.productForm.value, 0, 2)}`);
  console.log('Form values', this.productForm.value);
}

function handleReset() {
  this.productForm.reset();
}

const setForm = (form) => {
  this.productForm = form;
  this.productForm.meta = {
    handleReset: this.handleReset
  };
};

// const ListItems = ({ handler }) => (
//   <div>
//     <FieldArray
//       name="items"
//       render={({ controls }: FormArray) => (
//         <div>
//           <div>
//             <button type="button" onClick={() => addItem()}>
//               Add Item
//             </button>
//           </div>
//           {/* <h2>{controls.length ? "Items:" : null}</h2> */}
//           {controls.map((productControl: AbstractControl, index) => (
//             <div key={`${productControl.meta.key}-${String(index)}`}>
//               <FieldGroup
//                 control={productControl}
//                 render={() => (
//                   <div>
//                     <h2>-----------------------------</h2>
//                     <FieldControl
//                       name="name"
//                       render={({ handler }) => (
//                         <div>
//                           <label>Name:</label>
//                           <input {...handler()} />
//                         </div>
//                       )}
//                     />
//                     <FieldControl
//                       name="description"
//                       render={({ handler }) => (
//                         <div>
//                           <label>Description:</label>
//                           <input {...handler()} />
//                         </div>
//                       )}
//                     />
//                     <FieldControl
//                       name="price"
//                       render={({ handler }) => (
//                         <div>
//                           <label>Price:</label>
//                           <input type="number" {...handler()} />
//                         </div>
//                       )}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => this.removeItem(index)}
//                     >
//                       {" "}
//                       Remove Item
//                     </button>
//                   </div>
//                 )}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     />
//   </div>
// );

// Field config to configure form
const fieldConfig = {
  controls: {
    username: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Username' }
    },
    password: {
      render: TextInput,
      meta: {
        label: 'Password',
        type: 'password'
      },
      options: {
        validators: Validators.required
      }
    },
    number: {
      options: {
        validators: Validators.required
      },
      render: TextInput,
      meta: { label: 'Number', type: 'number' }
    },
    gender: {
      formState: 'male',
      render: RadioSelect
    },
    nationality: {
      render: SelectBox
    },
    notes: {
      render: TextArea
    },
    rememberMe: {
      render: CheckBox
    },
    // items: {
    //   render: ListItems,
    // },
    $field_0: {
      isStatic: false,
      render: ({ invalid, meta: { handleReset } }) => (
        <div>
          <Button type="button" className="btn btn-primary" onClick={handleReset}>
            Reset
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="submit" className="btn btn-success" disabled={invalid}>
            Submit
          </Button>
        </div>
      )
    }
  }
};

export default class SampleFormGenerator extends Component {
  handleReset = () => {
    this.loginForm.reset();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form values', this.loginForm.value);
  };

  setForm = (form) => {
    this.loginForm = form;
    this.loginForm.meta = {
      handleReset: this.handleReset
    };
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGenerator onMount={this.setForm} fieldConfig={fieldConfig} />
      </form>
    );
  }
}
