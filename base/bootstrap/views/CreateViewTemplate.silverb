@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <ol class="breadcrumb">
      <li><a href="/home">Home</a></li>
      <li><a href="{{ route('home.<$ this.model.getNamePlural() $>.index') }}"><$ this.model.getDescriptionPlural() $></a></li>
      <li class="active">New <$ this.model.getDescription() $></li>
    </ol>

    <div class="panel">
        <div class="panel-heading">
            <h3>New <$ this.model.getDescription() $></h3>
        </div>
        <div class="panel-body">
            {!! Form::open(['route' => 'home.<$ this.model.getNamePlural() $>.store', 'files' => true, 'id' => '<$ this.model.getName() $>-form']) !!}    
        
                @include('home.<$ this.model.getNamePlural() $>.fields')

                <div class="form-group col-xs-12 col-sm-12">
                    {!! Form::submit('Save', ['class' => 'btn btn-success']) !!}
                </div>

            {!! Form::close() !!}  
        </div>
    </div>

</div>
@endsection