import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, Segment} from 'ionic-angular';
//import {Cart} from "../../providers/cart";
import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import * as X2JS from 'xml2js';

//import * as X2JS from 'x2js';

declare var PagSeguroDirectPayment;
//declare const X2JS: any;

@Component({
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  @ViewChild(Segment)
  segment:Segment;
  paymentMethods:Array<any> = [];
  public paymentMethod = 'BOLETO';
  creditCard = {
    num: '',
    cvv: '',
    monthExp: '',
    yearExp: '',
    brand: '',
    token: ''
  };


  public xmlItems:any;


  constructor(private nav:NavController,
              private ref:ChangeDetectorRef,
              private http: Http) {
  }

  //ESSA É A BAGACEIRA VÉIA QUE NÃO TÁ FUNCIONANDO... O RESTO TA TUDO OK!

  getStatus(){
    //this.http.get("https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/738CB4B3-655A-49C6-B729-984E97B763DC?email=everson.magioni@gmail.com&token=EBFD37ADAB3D492396BE5B548E880686")
    //.map(res=>console.log(res))

    //this.http.get("https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/738CB4B3-655A-49C6-B729-984E97B763DC?email=everson.magioni@gmail.com&token=EBFD37ADAB3D492396BE5B548E880686")

    //.map(res=> this.teste(res))
    /*.map(res=> console.log(res))
    .subscribe(
      data => console.log(data),
      error=> console.log(error),
      ()=> console.log("completo"));*/






    /*let xml, erro;
    let dadosPagamento = this.http.get("https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/738CB4B3-655A-49C6-B729-984E97B763DC?email=everson.magioni@gmail.com&token=EBFD37ADAB3D492396BE5B548E880686");

    X2JS.parseString(dadosPagamento, (err, result)=>{
      xml = result;
      erro = err;
    });

    if(xml.transaction){
      console.log("MAOI");
    }*/

    this.http.get("https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/738CB4B3-655A-49C6-B729-984E97B763DC?email=everson.magioni@gmail.com&token=EBFD37ADAB3D492396BE5B548E880686")
    .map(res=>res.text())
    .subscribe(data=>{
      X2JS.parseString(data, (err, result)=>{
        this.convert(data);
      });
    })
    /*.map(res=> {
      console.log(res);
      let xml, erro;

      X2JS.parseString(res, (err, result)=>{
        xml = result;
        erro = err;

        console.log("Resultado do XML " + xml);
      })
    })
    //.map(res=> this.convert(res))
    .subscribe(
      data => console.log(data),
      error=> console.log(error),
      ()=> console.log("completo"));*/
  }

  convert(dadosPagamento){
    console.log("Dados Pagamento: " + dadosPagamento);

    let xml, erro;
                X2JS.parseString(dadosPagamento, (err, result) => {
                    xml = result; //.transaction.code[0] ? result.transaction.code[0] : undefined;
                    erro = err;
                    console.log("Resultado do XML" + xml);
                });

                if(xml.transaction){
                  console.log("Status da transação " + xml.transaction.status);
                }
                //if (xml.transaction) {

                    /*this.statusPagamento = {
                        'userId': this.usuario.id,
                        'codePayment': xml.transaction.code[0],
                        'planeId': this.plano.id,
                        'planeTime': this.plano.periodo,
                        'statusPayment': 1,
                        'credit': this.plano.id > this.meuPlano ? parseFloat(this.plano.value) : (this.creditoSomar + this.plano.value),
                        'valuePayment': parseFloat(this.plano.valueFinal),
                    }*/
    //}
  }

  teste(data){
    //let xml = "<code>TESTE</code>";
    let xml = data;
    let parser:any = new X2JS();
    let json = parser.xml2js(xml);

    console.log("Resultado " + JSON.stringify(json));
  }



  //FIM DA BAGACEIRA


  ngOnInit():any {
    PagSeguroDirectPayment.getPaymentMethods({
      amount: 100,
      success: response => {
        let paymentMethods = response.paymentMethods;
        this.paymentMethods = Object.keys(paymentMethods).map((k) => paymentMethods[k]);
        this.ref.detectChanges();
        this.segment.ngAfterContentInit();
      }
    });
  }

  getId(){
    var headers = new Headers();

    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    //var params = 'email=' + id + '&token=';
    var params = 'email=everson.magioni@gmail.com&token=EBFD37ADAB3D492396BE5B548E880686'


    this.http.post('https://ws.sandbox.pagseguro.uol.com.br/v2/sessions', params , {headers: headers})
      .subscribe(
        data => console.log("Retorno: " + data),
        err => console.log(err),
        () => console.log('Call Complete')
      );
  }

  setaId(){
    PagSeguroDirectPayment.setSessionId('55a343c569c64619ac9da8bcce4800de');
  }

  /*parseXML(data){
    return new Promise(resolve =>
      {
         var k,
             arr    = [],
             parser = new xml2js.Parser(
             {
                trim: true,
                explicitArray: true
             });

         parser.parseString(data, function (err, result)
         {
            var obj = result.comics;
            for(k in obj.publication)
            {
               var item = obj.publication[k];
               console.log("Item " + item);

            }

            resolve(arr);
         });
      });
  }*/

  segmentChanged(event){
    //this.paymentMethod = event.target.value;
    console.log(event._value);
    console.log("PaymentMethod " + event._value);
    this.paymentMethod = event._value;
    console.log(this.paymentMethod);
    this.setaForma(event._value);
  }

  setaForma(valor){
    this.paymentMethod = valor;
    console.log("To aqui!");
    this.ref.detectChanges();
  }

  getPayments(){
    PagSeguroDirectPayment.getPaymentMethods({
      amount: 300,
      success: response => {
        let paymentMethods = response.paymentMethods;
        console.log(paymentMethods);
        this.paymentMethods = Object.keys(paymentMethods).map((k) => paymentMethods[k]);
        this.ref.detectChanges();
        //this.segment.ngAfterViewInit();
        this.segment.ngAfterContentInit();
      }
    });
  }

  paymentCreditCard(){
    console.log("Enviando o pagamento");
    this.getCreditCardBrand();
  }

  getCreditCardBrand(){
    console.log("Pegando a bandeira do cartão!");

    console.log("Numero do cartao " + this.creditCard.num.substring(0,6));

    PagSeguroDirectPayment.getBrand({
      cardBin: this.creditCard.num.substring(0,6),
      success: response => {
        console.log(response.brand.name);
        this.creditCard.brand = response.brand.name
        this.ref.detectChanges();
        this.getCreditCardToken();
      },
      error: response =>{
        console.log("ERRO " + response.error);
      },
      complete: response =>{
        console.log("COMPLETE " + response);
      }
    });
  }

  getCreditCardToken(){
    console.log("Vou pegar o token do cartão!");

    console.log("Valores: ");
    console.log(this.creditCard.num);
    console.log(this.creditCard.brand);
    console.log(this.creditCard.cvv);
    console.log(this.creditCard.monthExp);
    console.log(this.creditCard.yearExp);

    PagSeguroDirectPayment.createCardToken({
      cardNumber: this.creditCard.num,
      brand: this.creditCard.brand,
      cvv: this.creditCard.cvv,
      expirationMonth: this.creditCard.monthExp,
      expirationYear: this.creditCard.yearExp,
      success: response => {
        console.log("Token do Cartão: " + response.card.token);
        this.creditCard.token = response.card.token
        this.ref.detectChanges();
        //this.sendPayment();
      },
      error: response =>{
        console.log("ERRO " + response.error);
      },
      complete: response =>{
        console.log("COMPLETE " + response);
      }
    });
  }

}
