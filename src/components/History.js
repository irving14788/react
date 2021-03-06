import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ModalMail } from './Modal';
import {Accordion} from './Accordion';
import { Icon } from 'react-icons-kit'
import {time} from 'react-icons-kit/ikons/time';

export class History extends Component{

  static propTypes = {
    idemail: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = { results: [], isOpen: false};
  }

  toggleModal = () =>{
    this.setState({
      isOpen:!this.state.isOpen
    })
    console.log("estado open = ",this.state.isOpen);
  }

  _renderResults(){
    return this.state.results.length === 0
    ? <p>Sin Resultados</p>
    :
    this.state.results.map((result) => {
      return (

          <Accordion.Pane title={result.estado + " - " +result.fechanotif} key={result.idemailtrack} >
            <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Estado</td>
                  <td>{result.estado}</td>
                </tr>
                <tr>
                  <td>Fecha de notificación</td>
                  <td>{result.fechanotif}</td>
                </tr>
                <tr>
                  <td>Dominio del emisor</td>
                  <td>{result.fromdomain}</td>
                </tr>
                <tr>
                  <td>Abierto desde </td>
                  <td>{result.sourceagent}</td>
                </tr>
                <tr>
                  <td>Notificación </td>
                  <td>{result.idnotif}</td>
                </tr>
              </tbody>
            </table>
            </div>
          </Accordion.Pane>
      )
    })

  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const {idemail} = this.props;
     console.log("idemail obtenido: ", idemail);
    fetch('https://fr7cftmyal.execute-api.us-east-1.amazonaws.com/Dev/obtdetallecorreo',{
           method: 'post',
           mode: 'cors',
           headers: {'Content-Type':'application/json'},
           body: JSON.stringify({
            "idemail": 1 //{idemail}
          })
          })
      .then((response) => {
        if (response.status !== 200) {
           console.log("status: ", response.status);
         }
         else {
           return response.json();
         }
      })
      .then((response) => {
      console.log("response: ", response);
      const{ search=[] } = response;
      console.log("data encontrada = ",{search});
      this.setState({ results:search});
      this.toggleModal();
      })
      .catch(function (err) {
       console.log("error: ", err);
      })
  }

  render(){
    return (
      <div>
        <div>
        <Icon icon={time} size={32} onClick={this._handleSubmit}/>
        </div>
        <ModalMail
            onClose={this.toggleModal}
            show={this.state.isOpen}
            title="Historial"
          >
            <Accordion customClass="accordionWrapper">
            {
                this._renderResults()
            }
            </Accordion>
          </ModalMail>
      </div>
    )
  }

}
