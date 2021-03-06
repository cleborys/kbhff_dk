Util.Modules["tally"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:", scene);


		scene.resized = function() {
//			u.bug("scene.resized:", this);
		}

		scene.scrolled = function() {
//			u.bug("scrolled:", this);
		}

		scene.ready = function() {
			// u.bug("scene.ready:", this);

			// page.cN.scene = this;

			if(!u.qs(".section.tally.closed")) {
				
				this.tally_id = u.cv(this, "tally_id");
				
				this.initStartCash();
				this.initEndCash();
				this.initDeposited();
				this.initPayouts();
				this.initMiscRevenues();
		
				this.comment_form = u.qs("form.comment", this);
				this.comment_form.scene = this;
				u.f.init(this.comment_form);
		
				this.comment_form.submitted = function(iN) {
		
					if(iN.hasAttribute("formaction")) {
		
						this.action = iN.getAttribute("formaction");
					}
		
					this.response = function(response) {

						var error_message = u.qs(".messages .error", response);

						if(error_message) {
							if(this.p_error) {

								this.p_error.parentNode.removeChild(this.p_error);
							} 

							this.p_error = u.ie(u.qs(".section.tally"), "p", {
								html:error_message.innerHTML,
								class:"error"
							})
						}
						else if(u.qs(".scene.shop_shift", response)) {
		
							location.href = "/butiksvagt"; 
						}
						else {
		
							location.href = "/butiksvagt/kasse/"+this.scene.tally_id;
						}
					} 
		
					u.request(this, this.action, {"method":"POST", "params":u.f.getParams(this)});
		
				}
		
				this.calculated_sales_by_the_piece = u.qs(".calculated_sales span.sum", this);
				this.change = u.qs(".change span.sum", this);
			}
	


			// // accept cookies?
			// page.acceptCookies();

			page.resized();
		}

		scene.initStartCash = function() {

			this.start_cash_view = u.qs(".start_cash .view");
			this.start_cash_view.edit_btn = u.qs(".edit_btn", this.start_cash_view);
			this.start_cash_view.amount = u.qs(".amount", this.start_cash_view);
			this.start_cash_view.edit_btn.scene = this;

			this.start_cash_edit = u.qs(".start_cash .edit");
			this.start_cash_edit.form = u.qs("form", this.start_cash_edit);
			this.start_cash_edit.form.scene = this;
			u.f.init(this.start_cash_edit.form);

			u.clickableElement(this.start_cash_view.edit_btn);
			this.start_cash_view.edit_btn.clicked = function() {


				u.as(this.scene.start_cash_view, "display", "none");
				u.as(this.scene.start_cash_edit, "display", "block");
				
				// console.log(this.scene.start_cash_edit.form.inputs)

				this.scene.start_cash_edit.form.inputs["start_cash"].focus()

			}
			
			this.start_cash_edit.form.submitted = function() {
				
				this.response = function(response) {
					// Update request state
					this.is_requesting = false;
					u.rc(this, "loading");
					
					// u.bug(response);

					var new_amount = u.text(u.qs(".start_cash .view .amount", response));

					this.scene.start_cash_view.amount.innerText = new_amount;
					
					u.as(this.scene.start_cash_edit, "display", "none");
					u.as(this.scene.start_cash_view, "display", "block");

					this.scene.updateCalculatedValues(response);
				}
				
				u.request(this, this.action, {"method":"POST", "params":u.f.getParams(this, {"send_as":"formdata"})});
			}

		}

		scene.initEndCash = function() {

			this.end_cash_view = u.qs(".end_cash .view");
			this.end_cash_view.edit_btn = u.qs(".edit_btn", this.end_cash_view);
			this.end_cash_view.amount = u.qs(".amount", this.end_cash_view);
			this.end_cash_view.edit_btn.scene = this;

			this.end_cash_edit = u.qs(".end_cash .edit");
			this.end_cash_edit.form = u.qs("form", this.end_cash_edit);
			this.end_cash_edit.form.scene = this;
			u.f.init(this.end_cash_edit.form);

			u.clickableElement(this.end_cash_view.edit_btn);
			this.end_cash_view.edit_btn.clicked = function() {


				u.as(this.scene.end_cash_view, "display", "none");
				u.as(this.scene.end_cash_edit, "display", "block");
				
				this.scene.end_cash_edit.form.inputs["end_cash"].focus()

			}
			
			this.end_cash_edit.form.submitted = function() {
				
				this.response = function(response) {
					// Update request state
					this.is_requesting = false;
					u.rc(this, "loading");
					
					u.bug(response);

					var new_amount = u.text(u.qs(".end_cash .view .amount", response));

					this.scene.end_cash_view.amount.innerText = new_amount;
					
					u.as(this.scene.end_cash_edit, "display", "none");
					u.as(this.scene.end_cash_view, "display", "block");

					this.scene.updateCalculatedValues(response);
				}
				
				u.request(this, this.action, {"method":"POST", "params":u.f.getParams(this, {"send_as":"formdata"})});
			}

		}

		scene.initDeposited = function() {

			this.deposited_view = u.qs(".deposited .view");
			this.deposited_view.edit_btn = u.qs(".edit_btn", this.deposited_view);
			this.deposited_view.amount = u.qs(".amount", this.deposited_view);
			this.deposited_view.edit_btn.scene = this;

			this.deposited_edit = u.qs(".deposited .edit");
			this.deposited_edit.form = u.qs("form", this.deposited_edit);
			this.deposited_edit.form.scene = this;
			u.f.init(this.deposited_edit.form);

			u.clickableElement(this.deposited_view.edit_btn);
			this.deposited_view.edit_btn.clicked = function() {


				u.as(this.scene.deposited_view, "display", "none");
				u.as(this.scene.deposited_edit, "display", "block");
				
				this.scene.deposited_edit.form.inputs["deposited"].focus()

			}
			
			this.deposited_edit.form.submitted = function() {
				
				this.response = function(response) {
					// Update request state
					this.is_requesting = false;
					u.rc(this, "loading");
					
					// u.bug(response);

					var new_amount = u.text(u.qs(".deposited .view .amount", response));

					this.scene.deposited_view.amount.innerText = new_amount;
					
					u.as(this.scene.deposited_edit, "display", "none");
					u.as(this.scene.deposited_view, "display", "block");

					this.scene.updateCalculatedValues(response);
				}
				
				u.request(this, this.action, {"method":"POST", "params":u.f.getParams(this, {"send_as":"formdata"})});
			}

		}

		scene.initPayouts = function() {

			this.tally_section = u.qs(".section.tally", this);
			this.payouts = u.qs(".payouts", this);
			this.calculated_sales_by_the_piece = u.qs(".calculated_sales span.sum", this);


			this.payouts.delete_forms = u.qsa("ul.payout .delete");
				if(this.payouts.delete_forms) {
				for (let i = 0; i < this.payouts.delete_forms.length; i++) {

					var delete_form = this.payouts.delete_forms[i];
					delete_form.scene = this;

					u.o.oneButtonForm.init(delete_form);

					delete_form.confirmed = function(response) {

						this.payouts = u.qs("div.payouts", response);
						this.scene.tally_section.replaceChild(this.payouts, this.scene.payouts);

						this.scene.updateCalculatedValues(response);

						this.scene.initPayouts();
					}
				}
			}
			
			this.payouts.div_add = u.qs("div.add_payout", this.payouts);
			this.payouts.div_add.ul = u.qs("ul.actions", this.payouts.div_add);

			this.payouts.btn_add = u.qs("li.add_payout", this.payouts);
			this.payouts.btn_add.scene = this;

			u.e.resetClickEvents(this.payouts.btn_add);
			u.ce(this.payouts.btn_add);
			
			this.payouts.btn_add.clicked = function() {

				this.response = function(response) {

					this.scene.payouts.div_add.form = u.qs("form.add_payout", response);
					this.scene.payouts.div_add.form.scene = this.scene;

					u.f.init(this.scene.payouts.div_add.form);

					
					this.scene.payouts.div_add.replaceChild(this.scene.payouts.div_add.form, this.scene.payouts.div_add.ul); 

					this.scene.payouts.div_add.form.inputs["payout_name"].focus();


					this.scene.payouts.div_add.form.submitted = function() {

						
						
						this.response = function(response) {
							
							this.scene.payouts.div_add.replaceChild(this.scene.payouts.div_add.ul, this.scene.payouts.div_add.form); 
							
							this.response = function(response) {
								
								this.payouts = u.qs("div.payouts", response);
								this.scene.tally_section.replaceChild(this.payouts, this.scene.payouts);
								
								this.scene.updateCalculatedValues(response);

								this.scene.initPayouts();
							}

							u.request(this, "/butiksvagt/kasse/" + this.scene.tally_id);

						}
						
						u.request(this, this.action, {"method":"POST", "params":u.f.getParams(this, {"send_as":"formdata"})});
					}

				}
				
				u.request(this, "/butiksvagt/kasse/" + this.scene.tally_id + "/udbetaling");

			}

		}

		scene.initMiscRevenues = function() {

			this.tally_section = u.qs(".section.tally", this);
			this.revenues = u.qs(".misc_revenues", this);
			this.calculated_sales_by_the_piece = u.qs(".calculated_sales span.sum", this);

			
			this.revenues.delete_forms = u.qsa("ul.revenue .delete");
				if(this.revenues.delete_forms) {
				for (let i = 0; i < this.revenues.delete_forms.length; i++) {

					var delete_form = this.revenues.delete_forms[i];
					delete_form.scene = this;

					u.o.oneButtonForm.init(delete_form);

					delete_form.confirmed = function(response) {

						this.revenues = u.qs("div.misc_revenues", response);
						this.scene.tally_section.replaceChild(this.revenues, this.scene.revenues);

						this.scene.updateCalculatedValues(response);

					this.scene.initMiscRevenues();
					}
				}
			}
			
			this.revenues.div_add = u.qs("div.add_revenue", this.revenues);
			this.revenues.div_add.ul = u.qs("ul.actions", this.revenues.div_add);

			this.revenues.btn_add = u.qs("li.add_revenue", this.revenues);
			this.revenues.btn_add.scene = this;

			u.e.resetClickEvents(this.revenues.btn_add);
			u.ce(this.revenues.btn_add);
			
			this.revenues.btn_add.clicked = function() {

				this.response = function(response) {

					this.scene.revenues.div_add.form = u.qs("form.add_revenue", response);
					this.scene.revenues.div_add.form.scene = this.scene;

					u.f.init(this.scene.revenues.div_add.form);

					this.scene.revenues.div_add.replaceChild(this.scene.revenues.div_add.form, this.scene.revenues.div_add.ul); 

					this.scene.revenues.div_add.form.inputs["revenue_name"].focus();

					this.scene.revenues.div_add.form.submitted = function() {

						this.response = function(response) {

							this.scene.revenues.div_add.replaceChild(this.scene.revenues.div_add.ul, this.scene.revenues.div_add.form); 

							this.response = function(response) {

								this.revenues = u.qs("div.misc_revenues", response);
								this.scene.tally_section.replaceChild(this.revenues, this.scene.revenues);
								
								this.scene.updateCalculatedValues(response);

								this.scene.initMiscRevenues();
							}

							u.request(this, "/butiksvagt/kasse/" + this.scene.tally_id);

						}
						
						u.request(this, this.action, {"method":"POST", "params":u.f.getParams(this, {"send_as":"formdata"})});
					}

				}
				
				u.request(this, "/butiksvagt/kasse/" + this.scene.tally_id + "/andre-indtaegter");

			}

		}

		scene.updateCalculatedValues = function(response) {
			
			var calculated_sales_by_the_piece = u.qs(".calculated_sales span.sum", response);
			if(calculated_sales_by_the_piece) {

				u.pn(this.calculated_sales_by_the_piece).replaceChild(calculated_sales_by_the_piece, this.calculated_sales_by_the_piece);
				this.calculated_sales_by_the_piece = calculated_sales_by_the_piece;
			}


			var change = u.qs(".change span.sum", response);
			if(change) {
				
				u.pn(this.change).replaceChild(change, this.change);
				this.change = change;
			}


		}

		

		// scene is ready
		scene.ready();

	}

}
