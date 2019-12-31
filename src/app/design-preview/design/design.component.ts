import { Component, OnInit } from '@angular/core';
import { InputType, ButtonPurpose, ButtonType, MheOption } from '@mhe/ngx-shared';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {

  collapseToggle: boolean = true; 
  inputType = InputType;
  _buttonPurpose = ButtonPurpose;
  buttonType = ButtonType;
  value = '';

  options: MheOption[] = [
    { value: 0, viewValue: 'Add Answer' },
    { value: 1, viewValue: 'Dropdown Choise' },
    { value: 2, viewValue: 'Free-Body Diagram' },
    { value: 3, viewValue: 'Multiple Choise' },
    { value: 4, viewValue: 'Multiselect' },
    { value: 5, viewValue: 'Numeric Input' },
    { value: 6, viewValue: 'True/False' }
  ];

  selectedSingle: MheOption[] = [this.options[0]];

  constructor() { }

  ngOnInit() {
  }

  rightPanelExpandCollapse() {
    this.collapseToggle = !this.collapseToggle;      
  }

  onSingleChange(selectedOptions: MheOption[]) {
    this.selectedSingle = [...selectedOptions];
    console.log('Single:', this.selectedSingle);
  }

}
