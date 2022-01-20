import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Alert, StatusBar } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';

import { getPlatformDate } from '../../utils/getPlatformDate';

import { CarDTO } from '../../dtos/CarDTO';

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';

interface RentalPeriodProps {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps)
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps)
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodProps>({} as RentalPeriodProps);

  const theme = useTheme();
  const { navigate, goBack }:NavigationProp<ParamListBase> = useNavigation();
  const route = useRoute();
  const { car } = route.params as Params;

  function handleSchedulingConfirm() {
    if(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted) {
      Alert.alert('Selecione um intervalo para alugar.')
    }else {
      navigate('SchedulingDetails', {
        car,
        dates: Object.keys(markedDates)
      });
    }
  }

  function handleGoBack() {
    goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy')
    })
  }

  return (
    <Container>
      <Header>
        <StatusBar 
          barStyle='light-content'
          translucent
          backgroundColor='transparent'
        />
        <BackButton 
          onPress={handleGoBack}
          color={theme.colors.shape}
        />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>
              {rentalPeriod.startFormatted}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.endFormatted}
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar 
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>

      <Footer>
        <Button title='Confirmar' onPress={handleSchedulingConfirm} />
      </Footer>
    </Container>
  );
}