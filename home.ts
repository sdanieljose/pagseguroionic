import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {NavController, Segment} from 'ionic-angular';
//import {Cart} from "../../providers/cart";
import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { xml2js } from 'xml2js';

declare var PagSeguroDirectPayment;

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
    this.http.get("https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/738CB4B3-655A-49C6-B729-984E97B763DC?email=everson.magioni@gmail.com&token=EBFD37ADAB3D492396BE5B548E880686")
    .map(res=> console.log(res))
    .subscribe(
      data => console.log(data),
      error=> console.log(error),
      ()=> console.log("completo"));
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

  parseXML(data){
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
               /*arr.push({
                  id           : item.code[0],
                  status           : item.status[0]
               });*/
            }

            resolve(arr);
         });
      });
  }

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
