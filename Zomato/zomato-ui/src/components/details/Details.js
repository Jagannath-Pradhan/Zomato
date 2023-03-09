import React from 'react';
import '../../Styles/details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../../Styles/header.css';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'brown'
  }
};
const secondStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'brown'
  }
};
const thirdStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    height: '400px'
  }
};
class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurantData: {},
      pictureModalIsOpen: false,
      itemModal: false,
      resturantId: undefined,
      menuItems: [],
      subtotal: 0,
      orderEntryModal: undefined,
      name: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      mobileNumber: undefined,
      address: undefined,
    }
  }
  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const resturantId = qs.resturant;

    axios({
      method: 'GET',
      url: `http://localhost:5000/api/resturantbyid/${resturantId}`,
      headers: { 'Content-Type': 'application/json' },
    }).then(response => this.setState({ restaurantData: response.data.resturant, resturantId })).catch()
  }

  // General Function
  handleModal = (state, value) => {
    const { resturantId } = this.state;
    console.log('res', resturantId);
    this.setState({ [state]: value });
    if (state == "itemModal" && value == true)
      axios(
        {
          method: 'GET',
          url: `http://localhost:5000/api/getMenu/${resturantId}`,
          headers: { 'Content-Type': 'application/json' }
        }
      ).then(response => {
        console.log("items", response.data.items)
        this.setState({ menuItems: response.data.items })
      }).catch(err => console.log(err))
  }

  addItems = (index, opType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];
    if (opType == 'add') {
      item.qty = item.qty++;
    }
    else {
      item.qty = item.qty--;
    }
    items[index] = item;
    items.map((item) => {
      total += item.qty * item.price;
    })
    this.setState({ menuItems: items, subTotal: total });
  }
  handleChange = (event, state) => {
    // const x = event.target.value;
    // switch(state)
    // {
    //   case 'mobileNumber':
    //     const pn =/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    //     if(x.value.match(pn))
    //     {
    //       this.setState({ [state]: event.target.value });
    //     }
    //     else
    //       alert('Invalid')
    //       this.setState({ [state]: event.target.value });    
    // } 
    this.setState({ [state]: event.target.value });
  };
  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];

    if (operationType == "add") {
      item.qty = item.qty + 1;
    } else {
      item.qty = item.qty - 1;
    }
    items[index] = item;
    items.map((item) => {
      total += item.qty * item.price;
    });
    this.setState({ menuItems: items, subTotal: total });
  };
  isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  isObj = (val) => {
    return typeof val === 'object'
  }

  stringifyValue = (val) => {
    if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val)
    } else {
      return val
    }
  }

  buildForm = ({ action, params }) => {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', this.stringifyValue(params[key]))
      form.appendChild(input)
    })

    return form
  }
  post = (details) => {
    const form = this.buildForm(details);
    document.body.appendChild(form);
    form.submit()
    form.remove()
  }
  getData = (data) => {
    return fetch(`http://localhost:5000/api/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).catch(err => console.log(err))
  }
  payment = () => {
    const { subTotal, email } = this.state;
    const emailCheck = localStorage.getItem('creditEmail')
    var re = /\S+@\S+\.\S+/;
    if (re.test(email) || re.test(emailCheck)) {
      //  Payment API Call
      this.getData({ amount: subTotal, email: email }).then((response) => {
        var information = {
          action: "https://securegw-stage.paytm.in/order/process",
          params: response,
        };
        this.post(information);
      });
    } else {
      alert("Email is not valid, Please check it");
    }
  };

  render() {
    const { restaurantData, pictureModalIsOpen, itemModal, menuItems, subtotal, orderEntryModal, name, email, mobileNumber, address } = this.state;
    console.log(restaurantData);
    return (
      <div>
        <div>
          <img src={restaurantData.image} alt="" className="detailMainPic" />
          <input type="submit" value="Click to see Image Gallery" className="btnClick" onClick={() => this.handleModal('pictureModalIsOpen', true)} />
        </div>
        <h1 className="DetailHeader">{restaurantData.name}</h1>
        <input type="submit" value="Place Online Order" className="btn-order" onClick={() => this.handleModal('itemModal', true)} />
        <div className="tabs">
          <div className="tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
            <label for="tab-1">Overview</label>

            <div className="content">
              <div className="about">About this place</div>
              <div className="Detailhead">Cuisine</div>
              <div className="Detailvalue">{restaurantData && restaurantData.cuisine ? restaurantData.cuisine.map((item) => `${item.name}, `) : null}</div>
              <div className="Detailhead">Average Cost</div>
              <div className="Detailvalue">&#8377; {restaurantData.min_price} for two people(approx)</div>
            </div>
          </div>

          <div className="tab">
            <input type="radio" id="tab-2" name="tab-group-1" />
            <label for="tab-2">Contact</label>

            <div className="content">
              <div className="Detailhead">Phone Number</div>
              <div className="Detailvalue-1">{restaurantData.contact}</div>
              <div className="Detailhead">{restaurantData.name}</div>
              <div className="Detailvalue">{`${restaurantData.locality}, ${restaurantData.city}`}</div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={pictureModalIsOpen}
          style={customStyles}
        >

          {/* <div  style={{backgroundColor:'brown',float:'right',margin:'5px'}}  >
                            
                            
                        </div> */}
          <div><span className="glyphicon glyphicon-remove" onClick={() => this.handleModal('pictureModalIsOpen', false)} style={{ float: 'right', margin: '5px' }}></span></div>
          <div>
            <Carousel showThumbs={false} >
              {restaurantData && restaurantData.thumb ? restaurantData.thumb.map((item) => {
                return <div>
                  <img src={item} className="carousel-img" />
                </div>
              }) : null
              }
            </Carousel>
          </div>
        </Modal>
        <Modal
          isOpen={itemModal}
          style={secondStyles}
        >
          <div style={{ backgroundColor: 'white', height: 'auto', width: '650px', float: 'right', margin: '5px', display: 'block', padding: '10px' }}  >
            <div><span className="glyphicon glyphicon-remove" onClick={() => this.handleModal('itemModal', false)} style={{ float: 'right', margin: '10px 10px 0px' }}></span>
            </div>
            <div style={{ 'height': 'auto', 'paddingBottom': '20px' }}>
              <div className="resName"><h1>{restaurantData.name}</h1></div>

              {menuItems && menuItems.length > 0 ?
                menuItems.map((item, index) => {
                  return (
                    <div id="box">
                      <div className="menuContainer">
                        <div className="menuInfo">
                          <h3 className="menuItemName" style={{ 'fontSize': '19px' }} >{item.name}</h3>
                          <h4 className="Rupees" style={{ 'fontSize': '17px' }}>Cost : &#8377;{item.price}</h4>
                          <div className="Deep">{item.description}</div>
                          <hr className="hor" />
                        </div>
                        {/* <img src ={item.image} className="image" /> */}
                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="image" src={`../${item.image}`} />
                          {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>ADD</button></div> :
                            <div className="subbutton"><button style={{ backgroundColor: 'white', border: 'none', borderRadius: '2px' }} onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white', border: 'none', borderRadius: '2px' }} className="qtyspan">{item.qty}</span><button className="addbutton" style={{ backgroundColor: 'white', border: 'none', borderRadius: '2px' }} onClick={() => this.addItems(index, 'add')}>+</button></div>}
                        </div>
                      </div>
                    </div>
                  )
                })
                : <div>Not avail</div>}
            </div>

            <div><h3 className="subtotal">SubTotal : {subtotal} {console.log(subtotal)}</h3>
              <button className="btn btn-danger pay" onClick={() => { this.handleModal("orderEntryModal", true); this.handleModal("itemModal", false); }}> Pay Now</button></div>
          </div>
        </Modal>
        <Modal isOpen={orderEntryModal} style={thirdStyles}>
          <div>
            <div
              className="glyphicon glyphicon-remove"
              style={{ float: "right", margin: "5px" }}
              onClick={() => this.handleModal("orderEntryModal", false)}
            ></div>
            <div className="restuarantName">{restaurantData.name}</div>
            <div className="AmountPaid">
              <span>Amount : </span>
              <span>{subtotal}</span>
            </div>
            <div className="customerName">NAME :
              <span className="customerNameInput">{localStorage.getItem('creditUser') == undefined ? localStorage.getItem('username') : localStorage.getItem('creditUser')} </span></div>
            <div className="customerName">E-MAIL :
              <span className="customerEmailInput">{localStorage.getItem('creditEmail') == undefined ? localStorage.getItem('email') : localStorage.getItem('creditEmail')} </span>
            </div>
            <div className="customerName">MOBILE NUMBER :</div>
            <input
              className="form-control form-control-lg"
              style={{
                width: "186px", marginLeft: "15px",
                position: 'absolute',
                top: '41%',
                left: '36%'
              }}
              type="phone"
              placeholder="Enter mobile number"
              onChange={(event) => this.handleChange(event, "mobileNumber")}
            />
            <div className="customerName">ADDRESS :</div>
            <textarea
              className="form-control form-control-lg"
              style={{
                width: "350px", width: '350px',
                marginLeft: '-1px',
                marginTop: '5px'
              }}
              type="text"
              placeholder="Enter your address"
              onChange={(event) => this.handleChange(event, "address")}
            />
            <button
              id="Proceed"
              className="btn btn-danger"
              style={{
                margin: '15px'
                , position: 'absolute',
                left: '12%',
                top: '76%'
              }}
              onClick={this.payment}
            >
              PROCEED
            </button>
          </div>
        </Modal>
      </div>

    )

  }
}

export default Details;