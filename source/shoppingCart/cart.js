export class Cart {
  static _key = 'recipeCart';
  static _read()  { return JSON.parse(localStorage.getItem(this._key) || '[]'); }
  static _write(c){ localStorage.setItem(this._key, JSON.stringify(c));
                   document.dispatchEvent(new CustomEvent('cart:update',{detail:c})); }
  static addRecipe(r){ const c=this._read();
    r.ingredients.forEach(({id,name,qty,unit})=>{
      if(!c.some(i=>i.id===id)) c.push({id,name,qty,unit});
    }); this._write(c);
  }
  static remove(id){ this._write(this._read().filter(i=>i.id!==id)); }
  static clear(){ localStorage.removeItem(this._key);
                  document.dispatchEvent(new Event('cart:update')); }
  static list(){ return this._read(); }
}