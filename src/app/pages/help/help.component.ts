import { Component, OnInit } from '@angular/core';
import { FaqsService } from 'src/app/services/faqs.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  faqs = [];
  constructor(public faqService: FaqsService) { }

  ngOnInit(): void {
    this.getFaqs();
  }

  getFaqs() {
    this.faqService.getFAQs().subscribe(data => {
      this.faqs = data;
    })
  }

}
