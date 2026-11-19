export const CENTER=[28.6139,77.209]
export const ESC=10 // seconds before an ignored listing escalates (demo speed)
export const BASE={meals:1180,kg:380}
export const TYPES={
 cooked:{label:'Cooked meal',hrs:4,ai:'Cooked rice and dal'},
 packaged:{label:'Packaged food',hrs:24,ai:'Sealed packaged meals'},
 bakery:{label:'Bakery items',hrs:12,ai:'Bread and baked goods'},
 fresh:{label:'Fruits and vegetables',hrs:8,ai:'Fresh produce'}}
export const PLACES={
 'Hotel Grand, Connaught Place':[28.6315,77.2167],'Banquet Hall, Karol Bagh':[28.6519,77.1907],
 'Restaurant, Lajpat Nagar':[28.5677,77.2437],'Wedding Lawn, Saket':[28.5245,77.2066],'Canteen, Rohini':[28.7495,77.0565]}
// Fictional NGOs for the demo
export const NGOS=[
 {id:'N1',name:'Asha Meals Trust',lat:28.6448,lng:77.2167,capacity:80,accepts:['cooked','packaged','bakery']},
 {id:'N2',name:'Seva Kitchen Foundation',lat:28.57,lng:77.24,capacity:50,accepts:['cooked','fresh']},
 {id:'N3',name:'Roti Bank Collective',lat:28.5355,lng:77.21,capacity:120,accepts:['cooked','packaged','bakery','fresh']},
 {id:'N4',name:'Annapurna Care Society',lat:28.74,lng:77.07,capacity:40,accepts:['packaged','bakery']},
 {id:'N5',name:'Hope Shelter Network',lat:28.5921,lng:77.046,capacity:90,accepts:['cooked','packaged']}]
