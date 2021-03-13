import { MatSliderModule } from '@angular/material/slider';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RectangleConfigComponent } from './rectangle-config.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOption } from '@angular/material/core';



describe('RectangleConfigComponent', () => {
    let component: RectangleConfigComponent;
    let fixture: ComponentFixture<RectangleConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleConfigComponent,MatLabel,MatOption],
            imports:[MatSliderModule,MatFormFieldModule,MatSelectModule,FormsModule,BrowserAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update Line width', () => {
        const expectedResult = 77;
        expect(component.updateLineWidth(expectedResult)).toEqual(expectedResult);
    });
});
