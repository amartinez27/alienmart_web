import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface, SwiperDirective, SwiperComponent } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss']
})
export class MainCarouselComponent implements OnInit, OnChanges {
  @Input('slides') slides: Array<any> = [];
  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: {
        loadPrevNext: true
      },
      autoplay: {
        delay: 6000
      },
      speed: 1000,
      effect: "slide"
    }
  }

  ngAfterViewChecked() {
    this.directiveRef.swiper().lazy.loadInSlide(0);
  }

  ngOnChanges() {
    if (this.slides.length > 0) {
      this.directiveRef.update();
    }
  }

}